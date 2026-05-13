import { PropertyEditorForm } from "@/components/dashboard/PropertyEditorForm";

export const metadata = { title: "Nouvelle annonce" };

export default function NouvelleAnnoncePage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white">Nouvelle annonce</h2>
      <p className="mt-1 text-sm text-zinc-400">Renseignez les informations principales du bien.</p>
      <div className="mt-8">
        <PropertyEditorForm mode="create" />
      </div>
    </div>
  );
}
