import type { Prisma } from "@prisma/client";

/** Colonne Prisma `Json` : tableau d’URLs d’images. */
export function parseImageUrls(value: Prisma.JsonValue | null | undefined): string[] {
  if (value == null) return [];
  if (!Array.isArray(value)) return [];
  return value.filter((x): x is string => typeof x === "string");
}
