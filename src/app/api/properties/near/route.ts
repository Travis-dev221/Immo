import { NextResponse } from "next/server";
import { Prisma, PropertyStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { nearQuerySchema } from "@/lib/validations/property";

const typeFilterSql = (type: "SALE" | "RENT" | undefined) =>
  type != null ? Prisma.sql`AND p.type = ${type}` : Prisma.empty;

/**
 * Recherche par rayon (km) — formule de Haversine, compatible MySQL / MariaDB (XAMPP).
 * Pas d’extension PostGIS nécessaire.
 */
async function queryIdsNear(
  lat: number,
  lng: number,
  radiusKm: number,
  type: "SALE" | "RENT" | undefined,
  skip: number,
  pageSize: number,
) {
  const typeFilter = typeFilterSql(type);

  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT p.id
    FROM Property p
    WHERE p.status = ${PropertyStatus.PUBLISHED}
    ${typeFilter}
    AND (
      6371 * ACOS(
        LEAST(1, GREATEST(-1,
          COS(RADIANS(${lat})) * COS(RADIANS(p.latitude)) * COS(RADIANS(p.longitude) - RADIANS(${lng}))
          + SIN(RADIANS(${lat})) * SIN(RADIANS(p.latitude))
        ))
      )
    ) <= ${radiusKm}
    ORDER BY p.createdAt DESC
    LIMIT ${pageSize} OFFSET ${skip}
  `;

  const countRows = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) AS count
    FROM Property p
    WHERE p.status = ${PropertyStatus.PUBLISHED}
    ${typeFilter}
    AND (
      6371 * ACOS(
        LEAST(1, GREATEST(-1,
          COS(RADIANS(${lat})) * COS(RADIANS(p.latitude)) * COS(RADIANS(p.longitude) - RADIANS(${lng}))
          + SIN(RADIANS(${lat})) * SIN(RADIANS(p.latitude))
        ))
      )
    ) <= ${radiusKm}
  `;

  return { ids: rows.map((r) => r.id), total: Number(countRows[0]?.count ?? 0) };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = nearQuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Paramètres invalides", details: parsed.error.flatten() }, { status: 400 });
    }

    const { lat, lng, radiusKm, type, page, pageSize } = parsed.data;
    const skip = (page - 1) * pageSize;

    const { ids, total } = await queryIdsNear(lat, lng, radiusKm, type, skip, pageSize);

    const items =
      ids.length === 0
        ? []
        : await prisma.property.findMany({
            where: { id: { in: ids } },
            include: {
              user: { select: { id: true, name: true, email: true, phone: true, image: true, avatar: true } },
            },
          });

    const orderIndex = new Map(ids.map((id, i) => [id, i]));
    items.sort((a, b) => (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0));

    return NextResponse.json({
      items,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      engine: "haversine_mysql",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error:
          "Impossible d’exécuter la recherche par rayon. Vérifiez que MySQL tourne et que DATABASE_URL dans .env est correct.",
      },
      { status: 500 },
    );
  }
}
