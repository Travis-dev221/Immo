import Link from "next/link";
import { PropertyStatus, PropertyType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/properties/PropertyCard";

type Search = Record<string, string | string[] | undefined>;

function parseNumber(v: string | undefined) {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function first(sp: Search, key: string) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

export const metadata = {
  title: "Location — VENTURE",
  description: "Annonces immobilières à la location — filtres et pagination.",
};

export default async function LocationPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseNumber(first(sp, "page")) ?? 1);
  const pageSize = 9;
  const city = first(sp, "city")?.trim();
  const priceMin = parseNumber(first(sp, "priceMin"));
  const priceMax = parseNumber(first(sp, "priceMax"));
  const surfaceMin = parseNumber(first(sp, "surfaceMin"));
  const rooms = parseNumber(first(sp, "rooms"));
  const bedrooms = parseNumber(first(sp, "bedrooms"));

  const where = {
    type: PropertyType.RENT,
    status: PropertyStatus.PUBLISHED,
    ...(city ? { city: { contains: city } } : {}),
    ...(priceMin != null || priceMax != null
      ? {
          price: {
            ...(priceMin != null ? { gte: priceMin } : {}),
            ...(priceMax != null ? { lte: priceMax } : {}),
          },
        }
      : {}),
    ...(surfaceMin != null ? { surface: { gte: surfaceMin } } : {}),
    ...(rooms != null ? { rooms: { gte: rooms } } : {}),
    ...(bedrooms != null ? { bedrooms: { gte: bedrooms } } : {}),
  };

  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.property.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function hrefWithPage(p: number) {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (priceMin != null) params.set("priceMin", String(priceMin));
    if (priceMax != null) params.set("priceMax", String(priceMax));
    if (surfaceMin != null) params.set("surfaceMin", String(surfaceMin));
    if (rooms != null) params.set("rooms", String(rooms));
    if (bedrooms != null) params.set("bedrooms", String(bedrooms));
    if (p > 1) params.set("page", String(p));
    const q = params.toString();
    return q ? `/location?${q}` : "/location";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900 px-6 py-12 shadow-2xl shadow-black/20 md:px-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80&auto=format&fit=crop)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/35" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-300/90">Location immobilière</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">À louer</h1>
            <p className="mt-4 text-base leading-7 text-zinc-300">
              Trouvez une villa, un appartement ou une résidence prête à accueillir votre prochain projet de vie.
            </p>
            <p className="mt-3 text-sm text-zinc-400">{total} annonce(s) publiée(s).</p>
          </div>
          <Link href="/recherche-proche" className="inline-flex items-center justify-center rounded-full border border-amber-300/40 px-5 py-3 text-sm font-medium text-amber-200 transition hover:bg-amber-300/10">
            Recherche dans un rayon
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["Locations vérifiées", "Des biens publiés pour faciliter une décision rapide et sereine."],
          ["Séjours et long terme", "Des options adaptées aux projets personnels, professionnels ou familiaux."],
          ["Zones recherchées", "Saly, Ngaparou, Somone et les secteurs attractifs de la Petite-Côte."],
        ].map(([title, text]) => (
          <article key={title} className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
          </article>
        ))}
      </section>

      <form className="mt-8 grid gap-3 rounded-2xl border border-white/10 bg-zinc-900/40 p-4 md:grid-cols-6" method="get">
        <input
          name="city"
          defaultValue={city ?? ""}
          placeholder="Ville"
          className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white md:col-span-2"
        />
        <input
          name="priceMin"
          type="number"
          defaultValue={priceMin ?? ""}
          placeholder="Loyer min / mois"
          className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
        <input
          name="priceMax"
          type="number"
          defaultValue={priceMax ?? ""}
          placeholder="Loyer max / mois"
          className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
        <input
          name="surfaceMin"
          type="number"
          defaultValue={surfaceMin ?? ""}
          placeholder="Surface min"
          className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
        <button
          type="submit"
          className="rounded-xl bg-amber-500 font-semibold text-zinc-950 hover:bg-amber-400 md:col-span-2"
        >
          Filtrer
        </button>
      </form>

      {items.length === 0 ? (
        <p className="mt-10 text-zinc-400">Aucun bien ne correspond à ces critères.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm">
          {page > 1 && (
            <Link
              className="rounded-full border border-white/15 px-3 py-1 text-zinc-200 hover:bg-white/5"
              href={hrefWithPage(page - 1)}
            >
              Précédent
            </Link>
          )}
          <span className="text-zinc-400">
            Page {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              className="rounded-full border border-white/15 px-3 py-1 text-zinc-200 hover:bg-white/5"
              href={hrefWithPage(page + 1)}
            >
              Suivant
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
