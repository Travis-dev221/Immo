import { GeneralContactForm } from "@/components/contact/GeneralContactForm";

export const metadata = {
  title: "Contact — VENTURE",
  description: "Contactez l’équipe VENTURE pour toute question sur l’immobilier.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900 px-6 py-12 shadow-2xl shadow-black/20 md:px-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=80&auto=format&fit=crop)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/35" />
        <div className="relative max-w-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300/90">Parlons de votre projet</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">Contact</h1>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            Une question sur une annonce, un mandat ou un partenariat ? Laissez-nous un message, nous vous répondrons avec attention.
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          {[
            ["Achat ou location", "Recevez une orientation claire selon votre budget et votre zone idéale."],
            ["Vendre un bien", "Confiez-nous votre propriété pour une mise en valeur sérieuse et locale."],
            ["Partenariat", "Échangeons sur les opportunités immobilières et professionnelles."],
          ].map(([title, text]) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
              <h2 className="text-base font-semibold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
            </article>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5 md:p-7">
          <GeneralContactForm />
        </div>
      </section>

      <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-500/10 p-5 text-sm leading-6 text-amber-100">
        Notre équipe connaît les réalités du terrain entre Saly, Ngaparou et Somone. Plus votre message est précis, plus notre réponse sera utile.
      </div>
    </div>
  );
}
