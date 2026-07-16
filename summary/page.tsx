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
    <main
          </div>
        )}
      </div>
    </main>
  );
}
