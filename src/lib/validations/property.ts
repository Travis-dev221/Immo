import { z } from "zod";
import { PropertyStatus, PropertyType } from "@prisma/client";

export const propertyCreateSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  surface: z.coerce.number().positive(),
  rooms: z.coerce.number().int().min(1).max(50),
  bedrooms: z.coerce.number().int().min(0).max(50),
  address: z.string().min(3),
  city: z.string().min(2),
  postalCode: z.string().min(4).max(12),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  type: z.nativeEnum(PropertyType),
  status: z.nativeEnum(PropertyStatus).optional(),
  images: z.array(z.string().min(1).max(2000)).max(20).default([]),
});

export const propertyUpdateSchema = propertyCreateSchema.partial();

export const propertyListQuerySchema = z.object({
  type: z.nativeEnum(PropertyType).optional(),
  city: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  surfaceMin: z.coerce.number().optional(),
  rooms: z.coerce.number().int().optional(),
  bedrooms: z.coerce.number().int().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
  sort: z.enum(["newest", "price_asc", "price_desc"]).default("newest"),
  /** Liste uniquement les biens de l’agent connecté (tous statuts) */
  mine: z.coerce.boolean().optional(),
  /** File d’attente modération (admin) */
  moderation: z.coerce.boolean().optional(),
});

export const nearQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().min(0.5).max(200).default(10),
  type: z.nativeEnum(PropertyType).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
});
