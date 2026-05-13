"use client";

import { useEffect, useState } from "react";

const MAX = 1352;

/** Colonne de numéros à droite : indice de défilement / « pagination visuelle » (1 → MAX). */
export function ScrollSideNumbers() {
  const [n, setN] = useState(1);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const p = scrollable > 0 ? window.scrollY / scrollable : 0;
      const value = Math.max(1, Math.min(MAX, Math.round(1 + p * (MAX - 1))));
      setN(value);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-2 top-1/2 z-30 hidden -translate-y-1/2 select-none flex-col items-end gap-1 text-[10px] font-mono text-white/25 lg:flex"
    >
      <span className="text-white/40">{n}</span>
      <div className="h-32 w-px bg-gradient-to-b from-white/30 to-transparent" />
      <span className="rotate-90 text-[9px] uppercase tracking-[0.35em] text-white/20">scroll</span>
    </div>
  );
}
