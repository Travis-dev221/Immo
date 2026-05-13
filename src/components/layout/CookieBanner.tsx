"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "venture_cookie_consent";

/**
 * Bandeau cookies minimal (RGPD) : stocke le choix en localStorage.
 * Les formulaires exigent en plus un consentement explicite au moment de l’envoi.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  function reject() {
    try {
      localStorage.setItem(STORAGE_KEY, "essential_only");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-zinc-900/95 p-4 text-sm text-zinc-200 shadow-2xl backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="leading-relaxed">
          Nous utilisons des cookies techniques nécessaires au fonctionnement du site et, avec votre accord, des
          mesures d’audience anonymisées. Vous pouvez accepter ou refuser les cookies non essentiels.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={reject}
            className="rounded-full border border-white/20 px-4 py-2 text-zinc-100 hover:bg-white/5"
          >
            Essentiels uniquement
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-amber-500 px-4 py-2 font-medium text-zinc-950 hover:bg-amber-400"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
