import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  phone: z.string().max(30).optional(),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "Vous devez accepter la politique de confidentialité." }),
});
