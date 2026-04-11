"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { GuestData } from "@/types/guest";

export async function addGuest(weddingId: string, data: GuestData) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return {
        success: false,
        message: "Anda belum login!",
      };
    }

    await prisma.guest.create({
      data: {
        weddingId,
        name: data.name,
        contact: data.contact,
        pax: data.pax,
      },
    });

    // Refresh halaman dashboard tamu
    revalidatePath("/guests");

    return { success: true, message: "Tamu berhasil ditambahkan!" };
  } catch (error) {
    console.log("GAGAL MENAMBAHKAN TAMU:", error);

    return { success: false, message: "Kesalahan pada server!" };
  }
}
