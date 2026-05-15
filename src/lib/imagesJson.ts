import type { Prisma } from "@prisma/client";

/** Colonne Prisma `Json` : tableau d’URLs d’images. */
export function parseImageUrls(value: Prisma.JsonValue | string | null | undefined): string[] {
  if (value == null) return [];
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((x): x is string => typeof x === "string");
    } catch {
      return [];
    }
  }
  if (!Array.isArray(value)) return [];
  return value.filter((x): x is string => typeof x === "string");
}
