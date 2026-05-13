"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function QuickSearch() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [surfaceMin, setSurfaceMin] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set("city", city.trim());
    if (priceMax) params.set("priceMax", priceMax);
    if (surfaceMin) params.set("surfaceMin", surfaceMin);
    router.push(`/vente?${params.toString()}`);
  }

  return (
    <section id="recherche" className="mx-auto max-w-5xl px-4 py-14 md:px-6">
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-xl backdrop-blur md:p-8">
        <h2 className="text-lg font-semibold text-white md:text-xl">Recherche rapide</h2>
        <p className="mt-1 text-sm text-zinc-400">Affinez les annonces à la vente selon vos critères principaux.</p>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-4">
          <label className="md:col-span-2">
            <span className="text-xs uppercase tracking-wide text-zinc-500">Ville</span>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950/80 px-3 py-2 text-sm text-white outline-none ring-amber-500/40 focus:ring-2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex. Saly, Somone…"
            />
          </label>
          <label>
            <span className="text-xs uppercase tracking-wide text-zinc-500">Budget max (CFA)</span>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950/80 px-3 py-2 text-sm text-white outline-none ring-amber-500/40 focus:ring-2"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder="85000000"
            />
          </label>
          <label>
            <span className="text-xs uppercase tracking-wide text-zinc-500">Surface min (m²)</span>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950/80 px-3 py-2 text-sm text-white outline-none ring-amber-500/40 focus:ring-2"
              value={surfaceMin}
              onChange={(e) => setSurfaceMin(e.target.value)}
              placeholder="80"
            />
          </label>
          <div className="md:col-span-4">
            <button
              type="submit"
              className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-400 md:w-auto md:px-10"
            >
              Voir les annonces
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
