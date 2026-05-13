import { GeneralContactForm } from "@/components/contact/GeneralContactForm";

export const metadata = {
  title: "Contact — VENTURE",
  description: "Contactez l’équipe VENTURE pour toute question sur l’immobilier.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="text-3xl font-semibold text-white">Contact</h1>
      <p className="mt-3 text-sm text-zinc-400">
        Une question sur une annonce, un mandat ou un partenariat ? Laissez-nous un message.
      </p>
      <div className="mt-10">
        <GeneralContactForm />
      </div>
    </div>
  );
}
