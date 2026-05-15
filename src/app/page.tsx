import Link from "next/link";
import { PropertyStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import { TypewriterHero } from "@/components/home/TypewriterHero";
import { QuickSearch } from "@/components/home/QuickSearch";
import { PropertyCard } from "@/components/properties/PropertyCard";

import SalyMapInner from "@/components/home/SalyMapInner";

const territories = [
  {
    name: "Somone",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80&auto=format&fit=crop",
    description: "Un cadre naturel paisible entre lagune, plages claires et villas confidentielles.",
  },
  {
    name: "Ngaparou",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=80&auto=format&fit=crop",
    description: "Une adresse recherchée pour investir, vivre au calme et rester proche de tout.",
  },
  {
    name: "Saly",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80&auto=format&fit=crop",
    description: "Le cœur vivant de la Petite-Côte, entre résidences, commerces et art de vivre.",
  },
  {
    name: "Ngerigne",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=900&q=80&auto=format&fit=crop",
    description: "Un secteur en développement, idéal pour les projets résidentiels et les investissements durables.",
  },
];

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

      <section className="relative overflow-hidden border-y border-white/5 bg-zinc-950 px-4 py-20 md:px-6">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300/90">Notre histoire</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-5xl">
              Une vision née sur la Petite-Côte.
            </h2>
            <p className="mt-6 text-base leading-8 text-zinc-300 md:text-lg">
              BAOBAB HORIZON accompagne celles et ceux qui veulent acheter, vendre ou investir dans des lieux qui ont une âme.
              Notre histoire commence entre Saly, Ngaparou, Somone et Ngerigne, là où l&apos;océan, la lumière et les projets de vie se rencontrent.
            </p>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              Nous sélectionnons des biens avec exigence, proximité et transparence pour transformer chaque recherche immobilière en expérience simple, humaine et mémorable.
            </p>
          </div>

          <div className="relative min-h-[420px]">
            <div
              className="story-image-left absolute left-0 top-8 h-64 w-[72%] rounded-[2rem] border border-white/10 bg-cover bg-center shadow-2xl shadow-black/40 transition duration-700 hover:-translate-y-2 hover:scale-[1.02]"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80&auto=format&fit=crop)",
              }}
            />
            <div
              className="story-image-right absolute bottom-0 right-0 h-72 w-[68%] rounded-[2rem] border border-amber-300/20 bg-cover bg-center shadow-2xl shadow-amber-950/30 transition duration-700 hover:-translate-y-2 hover:scale-[1.02]"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80&auto=format&fit=crop)",
              }}
            />
            <div className="absolute left-8 top-72 rounded-2xl border border-white/10 bg-zinc-950/80 px-5 py-4 shadow-xl backdrop-blur">
              <p className="text-3xl font-semibold text-amber-400">4</p>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Territoires clés</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-300/90">Notre zone d&apos;action</p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
            Quatre territoires, une entreprise.
          </h2>
          <p className="mt-5 text-sm leading-7 text-zinc-400 md:text-base">
            Somone, Ngaparou, Saly et Ngerigne forment notre terrain d&apos;expertise. Nous y connaissons les quartiers, les opportunités et les biens capables de créer de vraies histoires.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {territories.map((territory) => (
            <article
              key={territory.name}
              className="group relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900 shadow-2xl shadow-black/20"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-1000 group-hover:scale-110"
                style={{ backgroundImage: `url(${territory.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-amber-200/90">Petite-Côte</p>
                <h3 className="mt-3 text-3xl font-semibold text-white">{territory.name}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-200">{territory.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/vente"
            className="inline-flex items-center justify-center rounded-full bg-amber-500 px-9 py-4 text-sm font-semibold text-zinc-950 shadow-xl shadow-amber-500/20 transition hover:-translate-y-1 hover:bg-amber-400 hover:shadow-amber-500/30"
          >
            Explorer les biens
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/5 bg-zinc-950 px-4 py-20 md:px-6">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300/90">Confier mon bien</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-5xl">
              Vous souhaitez vendre ou louer votre propriété ?
            </h2>
            <p className="mt-5 text-sm leading-7 text-zinc-400 md:text-base">
              Nous vous accompagnons dans l&apos;estimation, la mise en valeur, la diffusion et le suivi des visites. Votre bien est présenté avec soin pour toucher les bons profils.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-3 text-sm font-semibold text-zinc-950 transition hover:-translate-y-1 hover:bg-amber-400"
              >
                Confier mon bien
              </Link>
              <Link
                href="/vente"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-3 text-sm font-medium text-white transition hover:bg-white/5"
              >
                Voir les biens
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              ["Estimation locale", "Une lecture réaliste du marché selon la zone et le type de bien."],
              ["Mise en valeur", "Photos, présentation claire et informations utiles pour rassurer."],
              ["Suivi humain", "Un accompagnement simple, régulier et transparent."],
            ].map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-300/90">Ils nous font confiance</p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">Des projets accompagnés avec attention.</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["Un accompagnement sérieux du début à la fin. Les informations étaient claires et les visites bien organisées.", "Achat à Saly"],
            ["L'équipe connaît vraiment le terrain. Nous avons trouvé une location adaptée rapidement.", "Location à Ngaparou"],
            ["Notre bien a été présenté proprement, avec un suivi régulier et des retours utiles.", "Mandat à Somone"],
          ].map(([quote, label]) => (
            <article key={label} className="rounded-[2rem] border border-white/10 bg-zinc-900/50 p-6">
              <p className="text-sm leading-7 text-zinc-300">“{quote}”</p>
              <p className="mt-5 text-xs uppercase tracking-[0.25em] text-amber-300">{label}</p>
            </article>
          ))}
        </div>
      </section>

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