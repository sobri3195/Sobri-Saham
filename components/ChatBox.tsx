"use client";

import { useState } from "react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userMsg: Msg = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-4 max-h-[450px] space-y-2 overflow-auto">
        {messages.map((msg, i) => (
          <div key={`${msg.role}-${i}`} className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${msg.role === "user" ? "ml-auto bg-blue-600 text-white" : "bg-slate-100"}`}>
            {msg.content}
          </div>
        ))}
        {loading && <p className="text-sm text-slate-500">Memproses analisis...</p>}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 rounded-md border px-3 py-2" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tanya: Analisa BBCA" />
        <button onClick={sendMessage} className="rounded-md bg-blue-600 px-4 py-2 text-white">Kirim</button>
      </div>
    </div>
  );
}
