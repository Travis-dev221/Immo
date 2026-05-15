import { NextResponse } from "next/server";
import { Prisma, PropertyStatus, PropertyType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { propertyCreateSchema, propertyListQuerySchema } from "@/lib/validations/property";

function getServerErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Erreur inconnue";
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = propertyListQuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Paramètres invalides", details: parsed.error.flatten() }, { status: 400 });
    }

    const q = parsed.data;
    const role = session?.user?.role;

    const where: Prisma.PropertyWhereInput = {
      ...(q.type ? { type: q.type as PropertyType } : {}),
      ...(q.city ? { city: { contains: q.city } } : {}),
      ...(q.priceMin != null || q.priceMax != null
        ? {
            price: {
              ...(q.priceMin != null ? { gte: q.priceMin } : {}),
              ...(q.priceMax != null ? { lte: q.priceMax } : {}),
            },
          }
        : {}),
      ...(q.surfaceMin != null ? { surface: { gte: q.surfaceMin } } : {}),
      ...(q.rooms != null ? { rooms: { gte: q.rooms } } : {}),
      ...(q.bedrooms != null ? { bedrooms: { gte: q.bedrooms } } : {}),
    };

    if (q.mine && role === "AGENT" && session?.user?.id) {
      where.userId = session.user.id;
    } else if (q.moderation && role === "ADMIN") {
      where.status = PropertyStatus.PENDING;
    } else {
      where.status = PropertyStatus.PUBLISHED;
    }

    const orderBy =
      q.sort === "price_asc"
        ? { price: "asc" as const }
        : q.sort === "price_desc"
          ? { price: "desc" as const }
          : { createdAt: "desc" as const };

    const skip = (q.page - 1) * q.pageSize;
    const [items, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: q.pageSize,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true, image: true, avatar: true } },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      items,
      page: q.page,
      pageSize: q.pageSize,
      total,
      totalPages: Math.ceil(total / q.pageSize),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "Erreur serveur",
        details: process.env.NODE_ENV === "development" ? getServerErrorMessage(e) : undefined,
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    if (session.user.role !== "AGENT" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Interdit" }, { status: 403 });
    }

    const dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: session.user.id },
          ...(session.user.email ? [{ email: session.user.email }] : []),
        ],
      },
      select: { id: true, role: true },
    });
    if (!dbUser) {
      return NextResponse.json({ error: "Utilisateur introuvable, reconnectez-vous" }, { status: 401 });
    }
    if (dbUser.role !== "AGENT" && dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Interdit" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = propertyCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const status =
      dbUser.role === "ADMIN" && data.status
        ? data.status
        : PropertyStatus.PENDING;

    const property = await prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        surface: data.surface,
        rooms: data.rooms,
        bedrooms: data.bedrooms,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        latitude: data.latitude,
        longitude: data.longitude,
        type: data.type,
        status,
        images: JSON.stringify(data.images),
        userId: dbUser.id,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "Erreur serveur",
        details: process.env.NODE_ENV === "development" ? getServerErrorMessage(e) : undefined,
      },
      { status: 500 },
    );
  }
}
