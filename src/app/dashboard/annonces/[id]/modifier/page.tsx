import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PropertyEditorForm } from "@/components/dashboard/PropertyEditorForm";

type PageProps = { params: Promise<{ id: string }> };

export const metadata = { title: "Modifier une annonce" };

export default async function ModifierAnnoncePage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) notFound();
  if (property.userId !== session!.user.id && session!.user.role !== "ADMIN") {
    redirect("/dashboard/annonces");
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-white">Modifier l’annonce</h2>
      <p className="mt-1 text-sm text-zinc-400">{property.title}</p>
      <div className="mt-8">
        <PropertyEditorForm key={property.id} mode="edit" propertyId={property.id} initial={property} />
      </div>
    </div>
  );
}
