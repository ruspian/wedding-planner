import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password harus minimal 8 karakter"),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, "Nama harus minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password harus minimal 8 karakter"),
});
