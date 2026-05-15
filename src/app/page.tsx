import Link from "next/link";
import { PropertyStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import { TypewriterHero } from "@/components/home/TypewriterHero";
import { QuickSearch } from "@/components/home/QuickSearch";
import { PropertyCard } from "@/components/properties/PropertyCard";

import SalyMapInner from "@/components/home/SalyMapInner";

export default async function HomePage() {
  const [saleCount, rentCount, featured] = await Promise.all([
    prisma.property.count({
      where: {
        status: PropertyStatus.PUBLISHED,
        type: "SALE",
      },
    }),

    prisma.property.count({
      where: {
        status: PropertyStatus.PUBLISHED,
        type: "RENT",
      },
    }),

    prisma.property.findMany({
      where: {
        status: PropertyStatus.PUBLISHED,
      },
      orderBy: {
        viewCount: "desc",
      },
      take: 3,
    }),
  ]);

  return (
    <>
      <TypewriterHero />

      <section className="border-y border-white/5 bg-zinc-950 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-10 px-4 text-center md:px-6">
          <div>
            <p className="text-3xl font-semibold text-white">
              {saleCount}
            </p>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Biens à vendre
            </p>
          </div>

          <div>
            <p className="text-3xl font-semibold text-white">
              {rentCount}
            </p>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Locations
            </p>
          </div>

          <div>
            <p className="text-3xl font-semibold text-amber-400">
              {saleCount + rentCount}
            </p>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Annonces publiées
            </p>
          </div>
        </div>
      </section>

      <QuickSearch />

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Coup de projecteur
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              Les biens les plus consultés cette semaine.
            </p>
          </div>

          <Link
            href="/vente"
            className="text-sm text-amber-300 hover:text-amber-200"
          >
            Tout voir
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="mt-8 text-sm text-zinc-500">
            Aucune annonce pour le moment.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 md:px-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white">
            Découvrez Saly, Sénégal
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Notre zone de prédilection avec des biens d&apos;exception.
          </p>
        </div>

        <SalyMapInner />
      </section>
    </>
  );
}