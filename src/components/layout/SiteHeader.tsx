"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/vente", label: "Vente" },
  { href: "/location", label: "Location" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          BAOBAB HORIZON
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-zinc-200 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`transition hover:text-white ${
                pathname === l.href ? "text-white" : "text-zinc-400"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              {(session.user.role === "AGENT" || session.user.role === "ADMIN") && (
                <Link className="hidden text-zinc-300 hover:text-white sm:inline" href="/dashboard">
                  Espace agent
                </Link>
              )}
              {session.user.role === "ADMIN" && (
                <Link className="hidden text-amber-200/90 hover:text-amber-100 sm:inline" href="/admin">
                  Admin
                </Link>
              )}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full border border-white/15 px-3 py-1 text-zinc-200 hover:bg-white/5"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link className="text-zinc-300 hover:text-white" href="/connexion">
                Connexion
              </Link>
              <Link
                className="rounded-full bg-amber-500 px-3 py-1 font-medium text-zinc-950 hover:bg-amber-400"
                href="/inscription"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
      <nav className="flex gap-4 overflow-x-auto border-t border-white/5 px-4 py-2 text-sm text-zinc-300 md:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="whitespace-nowrap hover:text-white">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
