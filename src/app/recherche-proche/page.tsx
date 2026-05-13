"use client";

import { useState } from "react";
import type { PropertyType } from "@prisma/client";
import { NearSearchPanel } from "@/components/properties/NearSearchPanel";

export default function RechercheProchePage() {
  const [type, setType] = useState<PropertyType>("SALE");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-semibold text-white">Recherche par rayon</h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-400">
        Indiquez un point (latitude / longitude) et un rayon en kilomètres. Le serveur applique la formule de Haversine
        (compatible MySQL / MariaDB, par ex. XAMPP).
      </p>
      <div className="mt-6 flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => setType("SALE")}
          className={`rounded-full px-4 py-1.5 ${type === "SALE" ? "bg-amber-500 text-zinc-950" : "border border-white/15 text-zinc-300 hover:bg-white/5"}`}
        >
          Vente
        </button>
        <button
          type="button"
          onClick={() => setType("RENT")}
          className={`rounded-full px-4 py-1.5 ${type === "RENT" ? "bg-amber-500 text-zinc-950" : "border border-white/15 text-zinc-300 hover:bg-white/5"}`}
        >
          Location
        </button>
      </div>
      <div className="mt-8">
        <NearSearchPanel type={type} />
      </div>
    </div>
  );
}
