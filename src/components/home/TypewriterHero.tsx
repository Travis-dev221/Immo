"use client";

import { useEffect, useMemo, useState } from "react";

const PHRASES = [
  "Trouvez la maison de vos rêves",
  "Vendez votre bien en toute confiance",
  "Investissez dans l'immobilier sereinement",
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1920&q=80&auto=format&fit=crop",
];

export function TypewriterHero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showRest, setShowRest] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const phrase = PHRASES[phraseIndex] ?? "";

  useEffect(() => {
    if (showRest) return;
    if (charIndex < phrase.length) {
      const t = window.setTimeout(() => setCharIndex((c) => c + 1), 42);
      return () => window.clearTimeout(t);
    }
    if (phraseIndex < PHRASES.length - 1) {
      const t = window.setTimeout(() => {
        setPhraseIndex((i) => i + 1);
        setCharIndex(0);
      }, 650);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setShowRest(true), 500);
    return () => window.clearTimeout(t);
  }, [charIndex, phrase, phraseIndex, showRest]);

  useEffect(() => {
    const t = window.setInterval(() => {
      setImageIndex((index) => (index + 1) % HERO_IMAGES.length);
    }, 3000);

    return () => window.clearInterval(t);
  }, []);

  const visible = useMemo(() => phrase.slice(0, charIndex), [phrase, charIndex]);

  return (
    <div className="relative min-h-[72vh] overflow-hidden">
      {HERO_IMAGES.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 bg-cover bg-center transition duration-1000 ease-in-out ${
            imageIndex === index ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-zinc-950" />
      <div className="relative mx-auto flex min-h-[72vh] max-w-4xl flex-col justify-center px-4 pb-24 pt-28 text-center md:px-6">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-200/90">Immobilier d’exception</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">
          <span className="inline-block min-h-[1.2em]">
            {visible}
            {!showRest && <span className="ml-0.5 inline-block h-[0.95em] w-0.5 animate-pulse bg-amber-400 align-[-0.1em]" />}
          </span>
        </h1>
        <div
          className={`mt-8 space-y-6 transition duration-700 ease-out ${
            showRest ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <p className="text-lg text-zinc-200 md:text-xl">
            Recherche rapide par ville, budget et surface — annonces vérifiées et agents disponibles.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/vente"
              className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-amber-500 px-8 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
            >
              Explorer les biens
            </a>
            <a
              href="#recherche"
              className="inline-flex min-w-[200px] items-center justify-center rounded-full border border-white/25 px-8 py-3 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Rechercher un bien
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
