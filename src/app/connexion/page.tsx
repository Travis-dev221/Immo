import { Suspense } from "react";
import { ConnexionForm } from "./ConnexionForm";

export const metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-16 text-center text-sm text-zinc-400">Chargement…</div>}>
      <ConnexionForm />
    </Suspense>
  );
}
