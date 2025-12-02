import z from "zod";

export const createAddressSchema = z.object({
  recipientName: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().min(10, "Invalid phone number"),
  street: z.string().min(3, "Street is required"),
  number: z.string().min(1, "Number is required"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Neighborhood is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().length(2, "State must be 2 characters (e.g., SP)"),
  zipCode: z.string().min(8, "Invalid zip code"),
  country: z.string().default("BR"),
  label: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export type CreateAddressSchema = z.infer<typeof createAddressSchema>;
