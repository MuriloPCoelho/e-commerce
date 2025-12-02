import { z } from "zod";

export const updateAddressSchema = z.object({
  id: z.string().uuid(),
  label: z.string().optional(),
  recipientName: z.string().min(1),
  phone: z.string().min(8),
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(8),
  isDefault: z.boolean().optional(),
});

export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
