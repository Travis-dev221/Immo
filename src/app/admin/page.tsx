import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deletePropertyAdminFromForm, publishPropertyFromForm, updateUserRoleFromForm } from "@/app/actions/admin";

export const metadata = { title: "Administration" };

export default async function AdminPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/");

  const [pending, users] = await Promise.all([
    prisma.property.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { email: true, name: true } } },
    }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 40 }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-semibold text-white">Administration</h1>
      <p className="mt-2 text-sm text-zinc-400">Modération des annonces et gestion des rôles utilisateurs.</p>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-white">Annonces en attente</h2>
        {pending.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">Aucune annonce à modérer.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {pending.map((p) => (
              <li key={p.id} className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
                <p className="font-medium text-white">{p.title}</p>
                <p className="text-xs text-zinc-500">
                  {p.city} · {p.user.email} · {p.type}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <form action={publishPropertyFromForm}>
                    <input type="hidden" name="propertyId" value={p.id} />
                    <button
                      type="submit"
                      className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-emerald-500"
                    >
                      Publier
                    </button>
                  </form>
                  <form action={deletePropertyAdminFromForm}>
                    <input type="hidden" name="propertyId" value={p.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-red-500/40 px-4 py-1.5 text-sm text-red-300 hover:bg-red-500/10"
                    >
                      Supprimer
                    </button>
                  </form>
                  <a href={`/biens/${p.id}`} className="text-sm text-amber-300 hover:text-amber-200">
                    Prévisualiser
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <h2 className="text-lg font-semibold text-white">Utilisateurs</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/80 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Rôle</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-white/5">
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">
                    {u.id === session.user.id ? (
                      <span className="text-xs text-zinc-600">Compte courant</span>
                    ) : (
                      <form action={updateUserRoleFromForm} className="flex flex-wrap items-center gap-2">
                        <input type="hidden" name="userId" value={u.id} />
                        <select name="role" defaultValue={u.role} className="rounded-lg border border-white/10 bg-zinc-950 px-2 py-1 text-xs text-white">
                          {Object.values(Role).map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className="rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/15">
                          Mettre à jour
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
