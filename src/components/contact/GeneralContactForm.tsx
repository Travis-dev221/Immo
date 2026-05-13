"use client";

import { useState } from "react";

export function GeneralContactForm() {
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
        body: JSON.stringify({ name, email, message, consent }),
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
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
      <label className="block text-sm">
        <span className="text-xs uppercase tracking-wide text-zinc-500">Nom</span>
        <input
          required
          className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="text-xs uppercase tracking-wide text-zinc-500">Email</span>
        <input
          required
          type="email"
          className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="text-xs uppercase tracking-wide text-zinc-500">Message</span>
        <textarea
          required
          minLength={10}
          rows={5}
          className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <label className="flex items-start gap-2 text-xs text-zinc-400">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        <span>J’accepte le traitement de mes données personnelles aux fins de prise de contact.</span>
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {status === "ok" && <p className="text-sm text-emerald-400">Merci — nous vous répondrons rapidement.</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
      >
        {status === "loading" ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}
