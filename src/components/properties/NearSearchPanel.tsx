"use client";

import { useState } from "react";
import type { PropertyType } from "@prisma/client";
import { PropertyCard, type PropertyForCard } from "@/components/properties/PropertyCard";

export function NearSearchPanel({ type }: { type: PropertyType }) {
  const [lat, setLat] = useState("45.7640");
  const [lng, setLng] = useState("4.8357");
  const [radiusKm, setRadiusKm] = useState("10");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<PropertyForCard[] | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        lat,
        lng,
        radiusKm,
        type,
        page: "1",
        pageSize: "12",
      });
      const res = await fetch(`/api/properties/near?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur");
        setItems([]);
        return;
      }
      setItems(data.items as PropertyForCard[]);
    } catch {
      setError("Erreur réseau");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-dashed border-amber-500/25 bg-zinc-950/40 p-4">
      <h2 className="text-sm font-semibold text-white">Recherche par rayon</h2>
      <p className="mt-1 text-xs text-zinc-500">
        Rayon en km autour d’un point GPS (latitude / longitude). Compatible MySQL / XAMPP.
      </p>
      <form onSubmit={search} className="mt-4 flex flex-col gap-2 md:flex-row md:flex-wrap md:items-end">
        <label className="text-xs text-zinc-400">
          Latitude
          <input className="mt-1 block w-full rounded-lg border border-white/10 bg-zinc-900 px-2 py-1 text-sm text-white" value={lat} onChange={(e) => setLat(e.target.value)} />
        </label>
        <label className="text-xs text-zinc-400">
          Longitude
          <input className="mt-1 block w-full rounded-lg border border-white/10 bg-zinc-900 px-2 py-1 text-sm text-white" value={lng} onChange={(e) => setLng(e.target.value)} />
        </label>
        <label className="text-xs text-zinc-400">
          Rayon (km)
          <input className="mt-1 block w-full rounded-lg border border-white/10 bg-zinc-900 px-2 py-1 text-sm text-white" value={radiusKm} onChange={(e) => setRadiusKm(e.target.value)} />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
        >
          {loading ? "Recherche…" : "Chercher autour"}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      {items && items.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
      {items && items.length === 0 && !error && <p className="mt-4 text-sm text-zinc-500">Aucun résultat dans ce rayon.</p>}
    </div>
  );
}
