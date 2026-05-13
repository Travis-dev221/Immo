import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactCreateSchema } from "@/lib/validations/contact";
import { sendMailSafe } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, message, propertyId } = parsed.data;

    if (propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: { user: true },
      });
      if (!property) {
        return NextResponse.json({ error: "Bien introuvable" }, { status: 404 });
      }

      await prisma.$transaction([
        prisma.contact.create({
          data: { name, email, message, propertyId },
        }),
        prisma.property.update({
          where: { id: propertyId },
          data: { contactCount: { increment: 1 } },
        }),
      ]);

      const agentEmail = property.user.email;
      await sendMailSafe({
        to: agentEmail,
        subject: `[VENTURE] Nouveau message pour « ${property.title} »`,
        text: `De : ${name} <${email}>\n\n${message}`,
      });
    } else {
      await prisma.contact.create({
        data: { name, email, message, propertyId: null },
      });
      const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
      if (admin?.email) {
        await sendMailSafe({
          to: admin.email,
          subject: "[VENTURE] Message contact général",
          text: `De : ${name} <${email}>\n\n${message}`,
        });
      }
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
