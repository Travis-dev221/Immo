import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Tableau de bord agent" };

export default async function DashboardHomePage() {
  const session = await auth();
  const userId = session!.user.id;

  const [props, published, pending, contacts] = await Promise.all([
    prisma.property.count({ where: { userId } }),
    prisma.property.count({ where: { userId, status: "PUBLISHED" } }),
    prisma.property.count({ where: { userId, status: "PENDING" } }),
    prisma.contact.count({ where: { property: { userId } } }),
  ]);

  const views = await prisma.property.aggregate({
    where: { userId },
    _sum: { viewCount: true },
  });

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Annonces</p>
          <p className="mt-2 text-3xl font-semibold text-white">{props}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Publiées</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-300">{published}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">En attente</p>
          <p className="mt-2 text-3xl font-semibold text-amber-300">{pending}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Vues cumulées</p>
          <p className="mt-2 text-3xl font-semibold text-white">{views._sum.viewCount ?? 0}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
        <p className="text-sm text-zinc-400">Messages reçus sur vos annonces</p>
        <p className="mt-2 text-4xl font-semibold text-white">{contacts}</p>
        <Link href="/dashboard/contacts" className="mt-4 inline-block text-sm text-amber-300 hover:text-amber-200">
          Voir les messages
        </Link>
      </div>
    </div>
  );
}
