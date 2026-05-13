import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Messages reçus" };

export default async function DashboardContactsPage() {
  const session = await auth();
  const items = await prisma.contact.findMany({
    where: { property: { userId: session!.user.id } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { property: { select: { id: true, title: true, city: true } } },
  });

  return (
    <div>
      <h2 className="text-lg font-semibold text-white">Messages</h2>
      <p className="mt-1 text-sm text-zinc-400">Demandes liées à vos annonces.</p>
      {items.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">Aucun message pour le moment.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {items.map((c) => (
            <li key={c.id} className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
              <p className="text-xs text-zinc-500">
                {c.property?.title} — {c.property?.city}
              </p>
              <p className="mt-2 text-sm font-medium text-white">
                {c.name} · <span className="text-zinc-400">{c.email}</span>
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-300">{c.message}</p>
              <p className="mt-2 text-xs text-zinc-600">{c.createdAt.toLocaleString("fr-FR")}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
