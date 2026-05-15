import { PrismaClient, PropertyStatus, PropertyType, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("demo123456", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@venture.demo" },
    update: {},
    create: {
      email: "admin@venture.demo",
      name: "Admin VENTURE",
      role: Role.ADMIN,
      passwordHash: password,
      phone: "+33 1 00 00 00 01",
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: "agent@venture.demo" },
    update: {
      name: "Agent Dia",
      phone: "+221 77 420 72 34",
    },
    create: {
      email: "agent@venture.demo",
      name: "Agent Dia",
      role: Role.AGENT,
      passwordHash: password,
      phone: "+221 77 420 72 34",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@venture.demo" },
    update: {},
    create: {
      email: "user@venture.demo",
      name: "Lucie Visiteuse",
      role: Role.USER,
      passwordHash: password,
    },
  });

  const imgs = (slug: string) => [
    `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80&auto=format&fit=crop`,
    `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop`,
  ];

  const samples = [
    {
      title: "Villa luxueuse avec piscine",
      description: "Superbe villa d'architecte lumineuse, grandes baies vitrées, cuisine américaine, grand jardin arboré avec piscine privative. Quartier résidentiel sécurisé.",
      price: 85000000,
      surface: 250,
      rooms: 6,
      bedrooms: 4,
      address: "Route de Saly",
      city: "Saly",
      postalCode: "Mbour",
      latitude: 14.4365,
      longitude: -17.0093,
      type: PropertyType.SALE,
      status: PropertyStatus.PUBLISHED,
      images: imgs("saly-villa"),
    },
    {
      title: "Résidence de charme arborée",
      description: "Magnifique propriété entourée de nature, idéale pour une résidence secondaire ou un investissement locatif. Espaces généreux et finitions soignées.",
      price: 110000000,
      surface: 300,
      rooms: 7,
      bedrooms: 5,
      address: "Quartier Résidentiel",
      city: "Nianing",
      postalCode: "Mbour",
      latitude: 14.3411,
      longitude: -16.9242,
      type: PropertyType.SALE,
      status: PropertyStatus.PUBLISHED,
      images: imgs("nianing"),
    },
    {
      title: "Maison paisible au bord de l'eau",
      description: "Maison authentique offrant une vue magnifique sur la côte. Idéale pour les amateurs de tranquillité. Comprend une grande terrasse et un accès direct à la plage.",
      price: 75000000,
      surface: 180,
      rooms: 4,
      bedrooms: 3,
      address: "Route de la Corniche",
      city: "Joal",
      postalCode: "Mbour",
      latitude: 14.1667,
      longitude: -16.8333,
      type: PropertyType.SALE,
      status: PropertyStatus.PUBLISHED,
      images: imgs("joal"),
    },
    {
      title: "Villa meublée avec piscine lagon",
      description: "Location longue durée d'une splendide villa meublée, climatisée avec une grande piscine. Située à deux pas de la lagune, dans un secteur très prisé.",
      price: 1500000,
      surface: 150,
      rooms: 4,
      bedrooms: 3,
      address: "Proche Lagune",
      city: "Somone",
      postalCode: "Mbour",
      latitude: 14.4925,
      longitude: -17.0544,
      type: PropertyType.RENT,
      status: PropertyStatus.PUBLISHED,
      images: imgs("somone-rent"),
    },
    {
      title: "Bel appartement de standing",
      description: "Appartement moderne, meublé et entièrement équipé. Résidence sécurisée avec gardiennage 24/7, parking souterrain et piscine commune.",
      price: 800000,
      surface: 100,
      rooms: 3,
      bedrooms: 2,
      address: "Centre touristique",
      city: "Saly",
      postalCode: "Mbour",
      latitude: 14.4390,
      longitude: -17.0100,
      type: PropertyType.RENT,
      status: PropertyStatus.PUBLISHED,
      images: imgs("saly-apt"),
    },
  ];

  await prisma.property.deleteMany({});
  for (const s of samples) {
    const existing = await prisma.property.findFirst({
      where: { title: s.title, userId: agent.id },
    });
    if (existing) continue;
    await prisma.property.create({
      data: { ...s, images: JSON.stringify(s.images), userId: agent.id, viewCount: Math.floor(Math.random() * 200), contactCount: Math.floor(Math.random() * 15) },
    });
  }

  const pub = await prisma.property.findFirst({
    where: { title: "Villa luxueuse avec piscine" },
  });
  if (pub) {
    await prisma.favorite.upsert({
      where: { userId_propertyId: { userId: admin.id, propertyId: pub.id } },
      create: { userId: admin.id, propertyId: pub.id },
      update: {},
    });
  }

  console.log("Seed OK — comptes démo :");
  console.log("  admin@venture.demo / demo123456");
  console.log("  agent@venture.demo / demo123456");
  console.log("  user@venture.demo / demo123456");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
