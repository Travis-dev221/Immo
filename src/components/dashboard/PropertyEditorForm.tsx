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

type ApiErrorDetails = {
  fieldErrors?: Record<string, string[] | undefined>;
  formErrors?: string[];
};

function formatApiError(error: string, details?: ApiErrorDetails | string) {
  if (typeof details === "string") {
    return `${error} : ${details}`;
  }
  const fieldErrors = details?.fieldErrors ? Object.entries(details.fieldErrors) : [];
  const firstFieldError = fieldErrors.find(([, messages]) => messages?.length);
  if (firstFieldError?.[1]?.[0]) {
    return `${error} : ${firstFieldError[0]} — ${firstFieldError[1][0]}`;
  }
  if (details?.formErrors?.[0]) {
    return `${error} : ${details.formErrors[0]}`;
  }
  return error;
}

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
  const [uploading, setUploading] = useState(false);

  async function onUploadImage(file: File) {
    setUploading(true);
    setError(null);

    try {
      let res = await fetch("/api/uploads/cloudinary-signature", {
        method: "POST",
      });

      if (res.ok) {
        const signatureData = await res.json();
        const cloudinaryData = new FormData();
        cloudinaryData.append("file", file);
        cloudinaryData.append("api_key", signatureData.apiKey);
        cloudinaryData.append("timestamp", String(signatureData.timestamp));
        cloudinaryData.append("signature", signatureData.signature);
        cloudinaryData.append("folder", signatureData.folder);

        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`, {
          method: "POST",
          body: cloudinaryData,
        });
        const cloudinaryResult = await cloudinaryRes.json();

        if (!cloudinaryRes.ok) {
          setError(cloudinaryResult.error?.message ?? "Upload Cloudinary impossible");
          return;
        }

        setValues((v) => ({
          ...v,
          imagesText: [v.imagesText.trim(), cloudinaryResult.secure_url].filter(Boolean).join("\n"),
        }));
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      res = await fetch("/api/uploads/properties", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Upload impossible");
        return;
      }

      setValues((v) => ({
        ...v,
        imagesText: [v.imagesText.trim(), data.url].filter(Boolean).join("\n"),
      }));
    } catch {
      setError("Upload impossible");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const images = values.imagesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      surface: Number(values.surface),
      rooms: Number(values.rooms),
      bedrooms: Number(values.bedrooms),
      address: values.address.trim(),
      city: values.city.trim(),
      postalCode: values.postalCode.trim(),
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
        setError(formatApiError(data.error ?? "Enregistrement impossible", data.details));
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
          <span className="text-xs text-zinc-500">Code postal ou zone</span>
          <input
            placeholder="Ex : Mbour, Saly, 23000…"
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
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={uploading}
            className="mt-2 block w-full cursor-pointer rounded-xl border border-dashed border-white/15 bg-zinc-950 px-3 py-3 text-sm text-zinc-300 file:mr-4 file:rounded-full file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-950 hover:border-amber-300/40 disabled:cursor-not-allowed disabled:opacity-60"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onUploadImage(file);
              e.currentTarget.value = "";
            }}
          />
          <span className="mt-2 block text-xs text-zinc-500">
            {uploading ? "Upload de l’image en cours…" : "Vous pouvez aussi coller une URL manuellement dans la zone ci-dessous."}
          </span>
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
