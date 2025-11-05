import z from "zod";

export const customerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
