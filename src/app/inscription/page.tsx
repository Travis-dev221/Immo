"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function InscriptionPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone: phone || undefined, consent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Inscription impossible");
        setLoading(false);
        return;
      }
      router.push("/connexion");
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 md:px-6">
      <h1 className="text-2xl font-semibold text-white">Inscription</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Déjà inscrit ?{" "}
        <Link className="text-amber-300 hover:text-amber-200" href="/connexion">
          Se connecter
        </Link>
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
        <label className="block text-sm">
          <span className="text-xs text-zinc-500">Nom</span>
          <input
            required
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-xs text-zinc-500">Email</span>
          <input
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-xs text-zinc-500">Téléphone (optionnel)</span>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-xs text-zinc-500">Mot de passe (8 caractères min.)</span>
          <input
            type="password"
            required
            minLength={8}
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="flex items-start gap-2 text-xs text-zinc-400">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
          <span>J’accepte la politique de confidentialité et la création de mon compte utilisateur.</span>
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
        >
          {loading ? "Création…" : "Créer mon compte"}
        </button>
      </form>
    </div>
  );
}
