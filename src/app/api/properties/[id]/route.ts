import { NextResponse } from "next/server";
import { PropertyStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { propertyUpdateSchema } from "@/lib/validations/property";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await auth();

    let property = await prisma.property.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, image: true, avatar: true } },
      },
    });

    if (!property) {
      return NextResponse.json({ error: "Bien introuvable" }, { status: 404 });
    }

    const canViewUnpublished =
      property.status === PropertyStatus.PUBLISHED ||
      session?.user?.role === "ADMIN" ||
      (session?.user?.role === "AGENT" && property.userId === session.user.id);

    if (!canViewUnpublished) {
      return NextResponse.json({ error: "Bien introuvable" }, { status: 404 });
    }

    if (property.status === PropertyStatus.PUBLISHED) {
      property = await prisma.property.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true, image: true, avatar: true } },
        },
      });
    }

    return NextResponse.json(property);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Bien introuvable" }, { status: 404 });
    }

    const isOwner = existing.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Interdit" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = propertyUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
    }

    const data = { ...parsed.data };
    if (data.status && !isAdmin) {
      delete data.status;
    }
    const { images, ...rest } = data;
    const updateData = {
      ...rest,
      ...(images ? { images: JSON.stringify(images) } : {}),
    };

    const property = await prisma.property.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(property);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Bien introuvable" }, { status: 404 });
    }

    const isOwner = existing.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Interdit" }, { status: 403 });
    }

    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
