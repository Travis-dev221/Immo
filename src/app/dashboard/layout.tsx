import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?callbackUrl=/dashboard");
  if (session.user.role !== "AGENT" && session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Espace agent</h1>
          <p className="text-sm text-zinc-400">Gestion des annonces et des messages.</p>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm">
          <Link className="rounded-full border border-white/15 px-3 py-1 text-zinc-200 hover:bg-white/5" href="/dashboard">
            Vue d’ensemble
          </Link>
          <Link className="rounded-full border border-white/15 px-3 py-1 text-zinc-200 hover:bg-white/5" href="/dashboard/annonces">
            Mes annonces
          </Link>
          <Link className="rounded-full border border-white/15 px-3 py-1 text-zinc-200 hover:bg-white/5" href="/dashboard/annonces/nouvelle">
            Nouvelle annonce
          </Link>
          <Link className="rounded-full border border-white/15 px-3 py-1 text-zinc-200 hover:bg-white/5" href="/dashboard/contacts">
            Messages
          </Link>
        </nav>
      </div>
      <div className="py-8">{children}</div>
    </div>
  );
}
