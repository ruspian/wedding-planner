import { z } from "zod";

export const SettingProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Nama harus minimal 2 karakter")
    .max(50, "Nama maksimal 50 karakter"),
  email: z.string().email("Email tidak valid"),
});

export const SettingSecuritySchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Password saat ini harus minimal 6 karakter"),
    newPassword: z.string().min(6, "Password baru harus minimal 6 karakter"),
    confirmNewPassword: z
      .string()
      .min(6, "Konfirmasi password baru harus minimal 6 karakter"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmNewPassword"],
  });
