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
