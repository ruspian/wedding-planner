"use server"; // Wajib ditaruh paling atas biar Next.js tau ini jalan di server!

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { SettingProfileSchema, SettingSecuritySchema } from "@/schemas/admin";
import { Prisma } from "@prisma/client";
import bcryptjs from "bcryptjs";

export async function toggleSuspendUser(userId: string) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Anda tidak memiliki akses!",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isSuspended: true },
    });

    if (!user) {
      return {
        success: false,
        message: "User tidak ditemukan!",
      };
    }

    // suspend atau unsuspend user
    await prisma.user.update({
      where: { id: userId },
      data: { isSuspended: !user.isSuspended },
    });

    // refresh cache
    revalidatePath("/admin/users");

    return {
      success: true,
      message: user.isSuspended
        ? "User berhasil di-unsuspend!"
        : "User berhasil di-suspend!",
    };
  } catch (error) {
    console.log("GAGAL SUSPEND ATAU UNSUSPEND USER", error);

    return { success: false, message: "Kesalahan pada server, coba lagi!" };
  }
}

export async function exportTransactionsCSV(searchQuery: string) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Anda tidak memiliki akses!" };
    }

    const whereClause = searchQuery
      ? {
          OR: [
            { id: { contains: searchQuery, mode: "insensitive" as const } },
            {
              user: {
                name: { contains: searchQuery, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {};

    // ambil data
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    const headers = [
      "ID Transaksi",
      "Tanggal Waktu",
      "Nama Pengguna",
      "Email",
      "Paket",
      "Metode Bayar",
      "Nominal (IDR)",
      "Status",
    ];

    // Format jadi baris-baris CSV
    const rows = transactions.map((trx) => {
      return [
        trx.id,
        trx.createdAt.toISOString(),
        trx.user?.name || "Unknown",
        trx.user?.email || "Unknown",
        trx.packageName,
        trx.method || "-",
        trx.amount.toString(),
        trx.status,
      ]
        .map((field) => `"${field}"`)
        .join(","); // bungkus data dengan kutip dan pisahkan dengan koma
    });

    // Gabungin header sama isi data pakai enter
    const csvContent = [headers.join(","), ...rows].join("\n");

    return { success: true, data: csvContent, message: "CSV berhasil dibuat!" };
  } catch (error) {
    console.log("GAGAL EXPORT CSV: ", error);

    return { success: false, message: "Kesalahan pada server!" };
  }
}

export async function updateAdminProfile(
  userId: string,
  data: { name: string; email: string },
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return {
        seccess: false,
        message: "Anda tidak memiliki akses!",
      };
    }

    const validate = SettingProfileSchema.safeParse(data);
    if (!validate.success) {
      return { success: false, message: validate.error.issues[0].message };
    }

    const { name, email } = validate.data;

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: name,
        email: email,
      },
    });

    // Refresh cache
    revalidatePath("/admin/settings");

    return { success: true, message: "Profil berhasil diperbarui!" };
  } catch (error) {
    console.log("GAGAL UPDATE PROFIL ADMIN: ", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "Email sudah digunakan oleh pengguna lain!",
        };
      }
    }

    return { success: false, message: "Kesalahan pada server!" };
  }
}

export async function updateAdminPassword(userId: string, newPassword: string) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Anda tidak memiliki akses!",
      };
    }

    const validate = SettingSecuritySchema.safeParse(newPassword);

    if (!validate.success) {
      return {
        success: false,
        message: validate.error.issues[0].message,
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (user?.password === validate.data.newPassword) {
      return {
        success: false,
        message: "Password baru tidak boleh sama dengan password lama!",
      };
    }

    const hashedPassword = await bcryptjs.hash(validate.data.newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true, message: "Password berhasil diperbarui!" };
  } catch (error) {
    console.log("GAGAL UBAH PASSWORD :", error);

    return { success: false, message: "Kesalahan pada server!" };
  }
}
