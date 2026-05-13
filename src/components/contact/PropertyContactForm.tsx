"use client";

import { useState } from "react";

export function PropertyContactForm({ propertyId }: { propertyId: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, propertyId, consent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data.error ?? "Envoi impossible");
        return;
      }
      setStatus("ok");
      setMessage("");
    } catch {
      setStatus("error");
      setError("Erreur réseau");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3 text-sm">
      <label className="block">
        <span className="text-xs text-zinc-500">Nom</span>
        <input
          required
          className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="block">
        <span className="text-xs text-zinc-500">Email</span>
        <input
          required
          type="email"
          className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="block">
        <span className="text-xs text-zinc-500">Message</span>
        <textarea
          required
          minLength={10}
          rows={4}
          className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-white"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <label className="flex items-start gap-2 text-xs text-zinc-400">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        <span>J’accepte que mes données soient utilisées pour répondre à ma demande (voir mentions légales).</span>
      </label>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {status === "ok" && <p className="text-xs text-emerald-400">Message envoyé. Merci !</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-amber-500 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
      >
        {status === "loading" ? "Envoi…" : "Contacter"}
      </button>
    </form>
  );
}
