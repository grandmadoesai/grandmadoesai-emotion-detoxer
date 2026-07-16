"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function HomeForm() {
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState("");

  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [preview, setPreview] = useState<any>(null);

  useEffect(() => {
    let sid = localStorage.getItem("buyer_session_id");
    if (!sid) {
      sid = "session_" + Date.now() + "_" + Math.random().toString(36).slice(2);
      localStorage.setItem("buyer_session_id", sid);
    }
    setSessionId(sid);
    loadProperties(sid);
  }, []);

  async function loadProperties(sid: string) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("session_id", sid)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSavedProperties(data);
    }
  }

  function resizeImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const maxDimension = 1600;
          let { width, height } = img;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not process image"));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          resolve(dataUrl.split(",")[1]);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleScan(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setScanError("");
    setPreview(null);

    try {
      const base64 = await resizeImageToBase64(file);
      const res = await fetch("/api/scan-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType: "image/jpeg" }),
      });

      let json: any = null;
      const rawBody = await res.text();
      try {
        json = JSON.parse(rawBody);
      } catch {
        setScanError(
          `Server returned non-JSON (status ${res.status}): ${rawBody.slice(0, 200)}`
        );
        setScanning(false);
        e.target.value = "";
        return;
      }

      if (!res.ok) {
        setScanError(json.error || "Something went wrong reading the image.");
      } else {
        setPreview(json.result);
      }
    } catch (err: any) {
      setScanError(
        `[${err?.name || "Error"}] ${err?.message || "Unknown"} (file type: ${file.type || "unknown"}, size: ${file.size})`
      );
    } finally {
      setScanning(false);
      e.target.value = "";
    }
  }

  async function handleSavePreview() {
    if (!preview) return;
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("properties").insert([
      {
        address: preview.address || "Unknown address",
        user_notes: notes.trim(),
        session_id: sessionId,
        price: preview.price,
        sqft: preview.sqft,
        bedrooms: preview.bedrooms,
        bathrooms: preview.bathrooms,
        year_built: preview.year_built,
        extracted_data: preview.extra || null,
      },
    ]);

    setLoading(false);

    if (error) {
      setMessage("Something went wrong: " + error.message);
    } else {
      setMessage("Property saved successfully!");
      setPreview(null);
      setNotes("");
      loadProperties(sessionId);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) {
      setMessage("Please enter an address.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("properties").insert([
      {
        address: address.trim(),
        user_notes: notes.trim(),
        session_id: sessionId,
      },
    ]);

    setLoading(false);

    if (error) {
      setMessage("Something went wrong: " + error.message);
    } else {
      setMessage("Property saved successfully!");
      setAddress("");
      setNotes("");
      loadProperties(sessionId);
    }
  }

  return (
    <main className="min-h-screen p-8 bg-[#F6F4EF] text-center">
      <h1 className="text-3xl font-extrabold text-[#16241D]">
        Objective Reality Matching System
      </h1>
      <p className="text-[#3F5C4C] mt-4">
        Enter the address of a home you toured today to save it for comparison.
      </p>
      <Link href="/summary" className="inline-block mt-3 text-sm text-[#3F5C4C] underline">
        View my saved properties →
      </Link>

      <div className="max-w-md mx-auto mt-8 text-left bg-white p-6 rounded-lg shadow">
        <label className="block text-sm font-semibold text-[#16241D] mb-2">
          📸 Scan a listing screenshot
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Upload a screenshot from Zillow, Redfin, or Realtor.com and we'll read the details for you.
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={handleScan}
          disabled={scanning}
          className="w-full text-sm"
        />
        {scanning && (
          <p className="mt-3 text-sm text-[#3F5C4C]">Reading listing…</p>
        )}
        {scanError && (
          <p className="mt-3 text-sm text-red-600 break-words">{scanError}</p>
        )}

        {preview && (
          <div className="mt-4 bg-[#F6F4EF] p-4 rounded-md">
            <p className="font-semibold text-[#16241D]">
              {preview.address || "Address not found"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {preview.price ? `$${preview.price.toLocaleString()}` : "—"}
              {preview.sqft ? ` · ${preview.sqft} sqft` : ""}
              {preview.bedrooms ? ` · ${preview.bedrooms} bd` : ""}
              {preview.bathrooms ? ` · ${preview.bathrooms} ba` : ""}
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note about this one (optional)"
              className="w-full border border-gray-300 rounded-md p-2 mt-3 text-sm"
              rows={2}
            />
            <button
              onClick={handleSavePreview}
              disabled={loading}
              className="w-full mt-3 py-2 rounded-md font-semibold text-white bg-[#3F5C4C] disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save this property"}
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 mt-8">— or add it manually —</p>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-4 text-left bg-white p-6 rounded-lg shadow"
      >
        <label className="block text-sm font-semibold text-[#16241D] mb-1">
          Property Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="1234 NE Main St, Vancouver, WA 98661"
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
        />

        <label className="block text-sm font-semibold text-[#16241D] mb-1">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. roof looked old, great kitchen, busy street"
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
          rows={3}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-md font-semibold text-white bg-[#3F5C4C] disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Save Property"}
        </button>

        {message && (
          <p className="mt-3 text-sm text-center text-[#16241D]">{message}</p>
        )}
      </form>

      {savedProperties.length > 0 && (
        <div className="max-w-2xl mx-auto mt-10 text-left">
          <h2 className="text-xl font-bold text-[#16241D] mb-4">
            Your Saved Properties ({savedProperties.length})
          </h2>
          <div className="space-y-3">
            {savedProperties.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded-md shadow border border-gray-200"
              >
                <p className="font-semibold text-[#16241D]">{p.address}</p>
                {p.price && (
                  <p className="text-sm text-gray-600 mt-1">
                    ${Number(p.price).toLocaleString()}
                    {p.sqft ? ` · ${p.sqft} sqft` : ""}
                  </p>
                )}
                {p.user_notes && (
                  <p className="text-sm text-gray-600 mt-1">{p.user_notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
