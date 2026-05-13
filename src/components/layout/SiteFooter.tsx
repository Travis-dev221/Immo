import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950 text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="text-sm font-semibold text-white">BAOBAB HORIZON</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed">
            Immobilier premium — vente et location, accompagnement personnalisé et outils modernes pour trouver ou
            valoriser votre bien.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
          <Link href="/vente" className="hover:text-white">
            Biens à vendre
          </Link>
          <Link href="/location" className="hover:text-white">
            Locations
          </Link>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} BAOBAB HORIZON — Tous droits réservés.
      </div>
    </footer>
  );
}
