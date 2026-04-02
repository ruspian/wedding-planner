"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createWeddingSetup(data: {
  brideName: string;
  groomName: string;
  weddingDate: string;
  totalBudget: number;
}) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return {
        success: false,
        message: "Anda belum login!",
      };
    }

    // Pastikan user belum punya project wedding (biar gak dobel)
    const existingWedding = await prisma.wedding.findFirst({
      where: { userId: session.user.id },
    });

    if (existingWedding) {
      return {
        success: false,
        message: "Anda sudah memiliki project wedding!",
      };
    }

    // Insert ke database
    await prisma.wedding.create({
      data: {
        userId: session.user.id,
        brideName: data.brideName,
        groomName: data.groomName,
        weddingDate: new Date(data.weddingDate), // Konversi string ke Date Prisma
        totalBudget: data.totalBudget,
      },
    });

    revalidatePath("/weddings");

    return { success: true };
  } catch (error) {
    console.log("GAGAL MEMBUAT DATA WEDDING", error);

    return { success: false, message: "Kesalahan pada server!" };
  }
}

export async function updateWeddingSetup(
  weddingId: string,
  data: {
    brideName: string;
    groomName: string;
    weddingDate: string;
    totalBudget: number;
  },
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return {
        success: false,
        message: "Anda belum login!",
      };
    }

    // Update ke database berdasarkan ID wedding
    await prisma.wedding.update({
      where: { id: weddingId },
      data: {
        brideName: data.brideName,
        groomName: data.groomName,
        weddingDate: new Date(data.weddingDate),
        totalBudget: data.totalBudget,
      },
    });

    // Refresh cache biar datanya langsung berubah di layar
    revalidatePath("/weddings");

    return { success: true, message: "Data wedding berhasil diperbarui!" };
  } catch (error) {
    console.log("GAGAL UPDATE DATA WEDDING", error);
    return { success: false, message: "Kesalahan pada server!" };
  }
}
