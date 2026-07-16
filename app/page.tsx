"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function HomeForm() {
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState("");

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
      <a href="/summary" className="inline-block mt-3 text-sm text-[#3F5C4C] underline">
        View my saved properties →
      </a>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-8 text-left bg-white p-6 rounded-lg shadow"
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
