import { z } from "zod";

export const hospitalFormSchema = z.object({
  hospitalName: z.string().min(1, "Hospital name is required"),
  contactEmail: z.string().email("Invalid email"),
  contactNumber: z.string().min(10, "Contact number is required"),
  hospitalWebsite: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  adminName: z.string().min(1, "Admin name is required"),
  adminEmail: z.string().email("Invalid admin email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gstNumber: z.string().optional(),
});

export type HospitalFormType = z.infer<typeof hospitalFormSchema>;