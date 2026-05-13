"use client";

import { useEffect, useState } from "react";

export function SplashAnimation() {
  const [show, setShow] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    // Le délai avant de commencer à cacher l'animation d'ouverture
    const timer1 = setTimeout(() => {
      setAnimateOut(true);
    }, 2500);

    // Retirer le composant du DOM après la transition
    const timer2 = setTimeout(() => {
      setShow(false);
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 transition-transform duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        animateOut ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="relative flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] md:tracking-[0.3em] text-amber-400 opacity-0 animate-fadeIn text-center">
          BAOBAB HORIZON
        </h1>
        <div className="mt-6 h-[1px] w-0 bg-amber-400/50 animate-expandWidth" />
        <p className="mt-6 text-xs uppercase tracking-[0.4em] text-zinc-400 opacity-0 animate-fadeInDelay">
          Immobilier d'exception
        </p>
      </div>
    </div>
  );
}
