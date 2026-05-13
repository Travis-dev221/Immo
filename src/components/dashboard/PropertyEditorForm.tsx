"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import type { Property, PropertyType } from "@prisma/client";
import { parseImageUrls } from "@/lib/imagesJson";

type Mode = "create" | "edit";

const empty = {
  title: "",
  description: "",
  price: "",
  surface: "",
  rooms: "4",
  bedrooms: "2",
  address: "",
  city: "",
  postalCode: "",
  latitude: "45.764",
  longitude: "4.835",
  type: "SALE" as PropertyType,
  imagesText: "",
};

export function PropertyEditorForm({
  mode,
  propertyId,
  initial,
}: {
  mode: Mode;
  propertyId?: string;
  initial?: Partial<Property>;
}) {
  const router = useRouter();
  const defaults = useMemo(() => {
    if (!initial) return empty;
    return {
      title: initial.title ?? "",
      description: initial.description ?? "",
      price: initial.price != null ? String(initial.price) : "",
      surface: initial.surface != null ? String(initial.surface) : "",
      rooms: initial.rooms != null ? String(initial.rooms) : "4",
      bedrooms: initial.bedrooms != null ? String(initial.bedrooms) : "2",
      address: initial.address ?? "",
      city: initial.city ?? "",
      postalCode: initial.postalCode ?? "",
      latitude: initial.latitude != null ? String(initial.latitude) : "45.764",
      longitude: initial.longitude != null ? String(initial.longitude) : "4.835",
      type: (initial.type as PropertyType) ?? "SALE",
      imagesText: parseImageUrls(initial.images).join("\n"),
    };
  }, [initial]);

  const [values, setValues] = useState(defaults);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const images = values.imagesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: values.title,
      description: values.description,
      price: Number(values.price),
      surface: Number(values.surface),
      rooms: Number(values.rooms),
      bedrooms: Number(values.bedrooms),
      address: values.address,
      city: values.city,
      postalCode: values.postalCode,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      type: values.type,
      images,
    };

    try {
      const url = mode === "create" ? "/api/properties" : `/api/properties/${propertyId}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Enregistrement impossible");
        setLoading(false);
        return;
      }
      router.push("/dashboard/annonces");
      router.refresh();
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm md:col-span-2">
          <span className="text-xs text-zinc-500">Titre</span>
          <input
            required
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={values.title}
            onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          />
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="text-xs text-zinc-500">Description</span>
          <textarea
            required
            minLength={10}
            rows={6}
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={values.description}
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          />
        </label>
        <label className="block text-sm">
          <span className="text-xs text-zinc-500">Prix (€ — loyer mensuel si location)</span>
          <input
            required
            type="number"
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={values.price}
            onChange={(e) => setValues((v) => ({ ...v, price: e.target.value }))}
          />
        </label>
        <label className="block text-sm">
          <span className="text-xs text-zinc-500">Surface (m²)</span>
          <input
            required
            type="number"
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={values.surface}
            onChange={(e) => setValues((v) => ({ ...v, surface: e.target.value }))}
          />
        </label>
        <label className="block text-sm">
          <span className="text-xs text-zinc-500">Pièces</span>
          <input
            required
            type="number"
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={values.rooms}
            onChange={(e) => setValues((v) => ({ ...v, rooms: e.target.value }))}
          />
        </label>
        <label className="block text-sm">
          <span className="text-xs text-zinc-500">Chambres</span>
          <input
            required
            type="number"
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={values.bedrooms}
            onChange={(e) => setValues((v) => ({ ...v, bedrooms: e.target.value }))}
          />
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="text-xs text-zinc-500">Adresse</span>
          <input
            required
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={values.address}
            onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))}
          />
        </label>
        <label className="block text-sm">
          <span className="text-xs text-zinc-500">Ville</span>
          <input
            required
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={values.city}
            onChange={(e) => setValues((v) => ({ ...v, city: e.target.value }))}
          />
        </label>
        <label className="block text-sm">
          <span className="text-xs text-zinc-500">Code postal</span>
          <input
            required
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={values.postalCode}
            onChange={(e) => setValues((v) => ({ ...v, postalCode: e.target.value }))}
          />
        </label>
        <label className="block text-sm">
          <span className="text-xs text-zinc-500">Latitude</span>
          <input
            required
            type="number"
            step="any"
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={values.latitude}
            onChange={(e) => setValues((v) => ({ ...v, latitude: e.target.value }))}
          />
        </label>
        <label className="block text-sm">
          <span className="text-xs text-zinc-500">Longitude</span>
          <input
            required
            type="number"
            step="any"
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={values.longitude}
            onChange={(e) => setValues((v) => ({ ...v, longitude: e.target.value }))}
          />
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="text-xs text-zinc-500">Type</span>
          <select
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={values.type}
            onChange={(e) => setValues((v) => ({ ...v, type: e.target.value as PropertyType }))}
          >
            <option value="SALE">Vente</option>
            <option value="RENT">Location</option>
          </select>
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="text-xs text-zinc-500">Images (une URL HTTPS par ligne — Unsplash, Cloudinary…)</span>
          <textarea
            rows={4}
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-white"
            value={values.imagesText}
            onChange={(e) => setValues((v) => ({ ...v, imagesText: e.target.value }))}
          />
        </label>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
      >
        {loading ? "Enregistrement…" : mode === "create" ? "Créer l’annonce" : "Mettre à jour"}
      </button>
      <p className="text-xs text-zinc-500">
        Les nouvelles annonces sont en statut « en attente » jusqu’à validation par un administrateur.
      </p>
    </form>
  );
}
