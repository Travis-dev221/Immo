import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPriceCFA } from "@/lib/format";

export const metadata = { title: "Mes annonces" };

export default async function DashboardPropertiesPage() {
  const session = await auth();
  const items = await prisma.property.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">Mes annonces</h2>
        <Link
          href="/dashboard/annonces/nouvelle"
          className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400"
        >
          Nouvelle annonce
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">Aucune annonce pour le moment.</p>
      ) : (
        <ul className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10">
          {items.map((p) => (
            <li key={p.id} className="flex flex-col gap-2 px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-white">{p.title}</p>
                <p className="text-xs text-zinc-500">
                  {p.city} · {p.status} · {formatPriceCFA(p.price, p.type)}
                </p>
                <p className="text-xs text-zinc-600">
                  Vues {p.viewCount} · Contacts {p.contactCount}
                </p>
              </div>
              <Link
                href={`/dashboard/annonces/${p.id}/modifier`}
                className="text-sm text-amber-300 hover:text-amber-200"
              >
                Modifier
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
