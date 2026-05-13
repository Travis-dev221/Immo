"use server";

import { revalidatePath } from "next/cache";
import { Role, PropertyStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Accès refusé");
  }
  return session;
}

export async function publishPropertyAction(propertyId: string) {
  await requireAdmin();
  await prisma.property.update({
    where: { id: propertyId },
    data: { status: PropertyStatus.PUBLISHED },
  });
  revalidatePath("/admin");
  revalidatePath("/vente");
  revalidatePath("/location");
  revalidatePath(`/biens/${propertyId}`);
}

export async function publishPropertyFromForm(formData: FormData) {
  const id = formData.get("propertyId");
  if (typeof id !== "string" || !id) throw new Error("Identifiant manquant");
  await publishPropertyAction(id);
}

export async function deletePropertyAdminFromForm(formData: FormData) {
  const id = formData.get("propertyId");
  if (typeof id !== "string" || !id) throw new Error("Identifiant manquant");
  await deletePropertyAdminAction(id);
}

export async function deletePropertyAdminAction(propertyId: string) {
  await requireAdmin();
  await prisma.property.delete({ where: { id: propertyId } });
  revalidatePath("/admin");
  revalidatePath("/vente");
  revalidatePath("/location");
}

const roleSchema = z.nativeEnum(Role);

export async function updateUserRoleAction(userId: string, role: Role) {
  await requireAdmin();
  roleSchema.parse(role);
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath("/admin");
}

export async function updateUserRoleFromForm(formData: FormData) {
  const userId = formData.get("userId");
  const role = formData.get("role");
  if (typeof userId !== "string" || typeof role !== "string") throw new Error("Données invalides");
  await updateUserRoleAction(userId, role as Role);
}
