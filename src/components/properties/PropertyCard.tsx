import Image from "next/image";
import Link from "next/link";
import type { Property, PropertyType } from "@prisma/client";
import { formatPriceCFA } from "@/lib/format";
import { parseImageUrls } from "@/lib/imagesJson";

type CardProperty = Pick<
  Property,
  "id" | "title" | "city" | "price" | "surface" | "rooms" | "bedrooms" | "type"
> & { images: Property["images"] };

export type PropertyForCard = CardProperty;

export function PropertyCard({ property }: { property: CardProperty }) {
  const urls = parseImageUrls(property.images);
  const cover = urls[0] ?? "/placeholder-property.svg";
  const typeLabel = property.type === "SALE" ? "À vendre" : "À louer";

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 transition hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5">
      <Link href={`/biens/${property.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-800">
          <Image
            src={cover}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width:768px) 100vw, 33vw"
            loading="lazy"
          />
          <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2 py-1 text-xs text-white backdrop-blur">
            {typeLabel}
          </span>
        </div>
        <div className="space-y-2 p-4">
          <h3 className="line-clamp-2 text-base font-semibold text-white group-hover:text-amber-200">{property.title}</h3>
          <p className="text-sm text-zinc-400">{property.city}</p>
          <div className="flex flex-wrap gap-3 text-xs text-zinc-400">
            <span>{property.surface} m²</span>
            <span>{property.rooms} pièces</span>
            <span>{property.bedrooms} ch.</span>
          </div>
          <p className="text-sm font-semibold text-amber-400">{formatPriceCFA(property.price, property.type)}</p>
        </div>
      </Link>
    </article>
  );
}
