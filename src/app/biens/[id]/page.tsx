import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPriceCFA } from "@/lib/format";
import { parseImageUrls } from "@/lib/imagesJson";
import { PropertyMap } from "@/components/map/PropertyMap";
import { FavoriteButton } from "@/components/properties/FavoriteButton";
import { PropertyContactForm } from "@/components/contact/PropertyContactForm";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const p = await prisma.property.findUnique({
    where: { id },
    select: { title: true, city: true, description: true, status: true },
  });
  if (!p || p.status !== PropertyStatus.PUBLISHED) {
    return { title: "Bien — VENTURE" };
  }
  return {
    title: `${p.title} — BAOBAB HORIZON`,
    description: `${p.title} à ${p.city}. ${p.description.slice(0, 140)}…`,
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  const base = await prisma.property.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true, phone: true, image: true, avatar: true } } },
  });

  if (!base) notFound();

  const canView =
    base.status === PropertyStatus.PUBLISHED ||
    session?.user?.role === "ADMIN" ||
    (session?.user?.role === "AGENT" && base.userId === session.user.id);

  if (!canView) notFound();

  const property =
    base.status === PropertyStatus.PUBLISHED
      ? await prisma.property.update({
          where: { id },
          data: { viewCount: { increment: 1 } },
          include: {
            user: { select: { id: true, name: true, email: true, phone: true, image: true, avatar: true } },
          },
        })
      : base;

  let initialFavorite = false;
  if (session?.user?.id) {
    const fav = await prisma.favorite.findUnique({
      where: { userId_propertyId: { userId: session.user.id, propertyId: id } },
    });
    initialFavorite = Boolean(fav);
  }

  const imgUrls = parseImageUrls(property.images);
  const imgs = imgUrls.length ? imgUrls : ["/placeholder-property.svg"];

  return (
    <article className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300/90">
            {property.type === "SALE" ? "À vendre" : "À louer"} · {property.city}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{property.title}</h1>
          <p className="mt-2 text-2xl font-semibold text-amber-400">{formatPriceCFA(property.price, property.type)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {property.status === PropertyStatus.PUBLISHED && (
            <FavoriteButton propertyId={property.id} initialIsFavorite={initialFavorite} />
          )}
          <Link href={property.type === "SALE" ? "/vente" : "/location"} className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-200 hover:bg-white/5">
            Retour aux annonces
          </Link>
        </div>
      </div>

      {property.status !== PropertyStatus.PUBLISHED && (
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Cette annonce n’est pas encore publique (statut : {property.status}).
        </p>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {imgs.map((src, i) => (
          <div key={`${src}-${i}`} className={`relative overflow-hidden rounded-2xl bg-zinc-800 ${i === 0 ? "sm:col-span-2 aspect-[21/9]" : "aspect-video"}`}>
            <Image src={src} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" priority={i === 0} loading={i === 0 ? "eager" : "lazy"} />
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-white">Description</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{property.description}</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white">Caractéristiques</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-zinc-300 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-3">
                <dt className="text-xs text-zinc-500">Surface</dt>
                <dd className="font-medium text-white">{property.surface} m²</dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-3">
                <dt className="text-xs text-zinc-500">Pièces</dt>
                <dd className="font-medium text-white">{property.rooms}</dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-3">
                <dt className="text-xs text-zinc-500">Chambres</dt>
                <dd className="font-medium text-white">{property.bedrooms}</dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-3 sm:col-span-3">
                <dt className="text-xs text-zinc-500">Adresse</dt>
                <dd className="font-medium text-white">
                  {property.address}, {property.postalCode} {property.city}
                </dd>
              </div>
            </dl>
          </section>
        </div>
        <aside className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
            <h2 className="text-sm font-semibold text-white">Contact annonce</h2>
            <p className="mt-2 text-xs text-zinc-500">Réf. {property.id}</p>
            <PropertyContactForm propertyId={property.id} />
          </section>
          <section className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
            <h2 className="text-sm font-semibold text-white">Agent</h2>
            <p className="mt-2 text-sm text-zinc-200">{property.user.name ?? "Agent Dia"}</p>
            {property.user.phone && <p className="text-sm text-zinc-400">{property.user.phone}</p>}
            <p className="text-sm text-zinc-400">{property.user.email}</p>
            <a 
              href={`https://wa.me/${(property.user.phone || "+221774207234").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par votre bien : ${property.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Contacter sur WhatsApp
            </a>
          </section>
          {property.status === PropertyStatus.PUBLISHED && (
            <section>
              <h2 className="text-sm font-semibold text-white">Localisation</h2>
              <div className="mt-3">
                <PropertyMap lat={property.latitude} lng={property.longitude} />
              </div>
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}
