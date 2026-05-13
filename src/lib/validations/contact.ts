import { z } from "zod";

export const contactCreateSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
  propertyId: z.string().cuid().optional().nullable(),
  /** Consentement RGPD explicite (doit être true) */
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "Le consentement est requis pour traiter votre demande." }),
});
