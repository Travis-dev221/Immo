"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function FavoriteButton({
  propertyId,
  initialIsFavorite,
}: {
  propertyId: string;
  initialIsFavorite: boolean;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  async function toggle() {
    if (status !== "authenticated") {
      router.push(`/connexion?callbackUrl=/biens/${propertyId}`);
      return;
    }
    setLoading(true);
    try {
      if (isFavorite) {
        const res = await fetch(`/api/favorites/${propertyId}`, { method: "DELETE" });
        if (res.ok) setIsFavorite(false);
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId }),
        });
        if (res.ok) setIsFavorite(true);
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={toggle}
      className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-100 hover:bg-white/5 disabled:opacity-50"
    >
      {loading ? "…" : isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    </button>
  );
}
