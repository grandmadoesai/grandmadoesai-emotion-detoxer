"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function SummaryPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sid = localStorage.getItem("buyer_session_id");
    if (sid) {
      loadProperties(sid);
    } else {
      setLoading(false);
    }
  }, []);

  async function loadProperties(sid: string) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("session_id", sid)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProperties(data);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen p-8 bg-[#F6F4EF]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#16241D] text-center">
          Your Property Comparison
        </h1>
        <p className="text-[#3F5C4C] mt-2 text-center">
          All the homes you've saved, side by side.
        </p>

        <div className="mt-6 text-center">
          
            href="/"
            className="inline-block text-sm text-[#3F5C4C] underline"
          >
            ← Back to add another property
          </a>
        </div>

        {loading ? (
          <p className="text-center mt-10 text-gray-500">Loading...</p>
        ) : properties.length === 0 ? (
          <div className="mt-10 text-center bg-white p-8 rounded-lg shadow">
            <p className="text-gray-600">
              You haven't saved any properties yet.
            </p>
            
              href="/"
              className="inline-block mt-4 py-2 px-4 rounded-md font-semibold text-white bg-[#3F5C4C]"
            >
              Add your first property
            </a>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow overflow-hidden">
              <thead className="bg-[#3F5C4C] text-white">
                <tr>
                  <th className="text-left p-3">#</th>
                  <th className="text-left p-3">Address</th>
                  <th className="text-left p-3">Notes</th>
                  <th className="text-left p-3">Date Saved</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p, i) => (
                  <tr
                    key={p.id}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EF]"}
                  >
                    <td className="p-3 text-gray-500">{i + 1}</td>
                    <td className="p-3 font-semibold text-[#16241D]">
                      {p.address}
                    </td>
                    <td className="p-3 text-gray-600">
                      {p.user_notes || "—"}
                    </td>
                    <td className="p-3 text-gray-500 text-sm">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
