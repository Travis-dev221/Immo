"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false, callbackUrl });
    setLoading(false);
    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 md:px-6">
      <h1 className="text-2xl font-semibold text-white">Connexion</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Pas encore de compte ?{" "}
        <Link className="text-amber-300 hover:text-amber-200" href="/inscription">
          Créer un compte
        </Link>
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
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
          <span className="text-xs text-zinc-500">Mot de passe</span>
          <input
            type="password"
            required
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-zinc-500">
        Comptes démo après <code className="text-zinc-400">npm run db:seed</code> : agent@venture.demo / demo123456
      </p>
    </div>
  );
}
