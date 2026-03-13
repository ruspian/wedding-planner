"use server"; // Wajib ditaruh paling atas biar Next.js tau ini jalan di server!

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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
