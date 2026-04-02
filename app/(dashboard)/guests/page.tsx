import GuestListClient from "@/components/layout/GuestListClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function GuestListPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  // Cari data nikahan milik user ini
  const wedding = await prisma.wedding.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  // if (!wedding) {
  //   redirect("/dashboard"); // Atau arahin ke halaman setup nikahan
  // }

  // Tarik data tamu (Karena gak ada createdAt di skema lo, kita urutin berdasar ID/Waktu input)
  const guests = await prisma.guest.findMany({
    where: { weddingId: wedding?.id },
    orderBy: { id: "desc" },
  });

  // Hitung Statistik
  const totalGuests = guests.length;
  const attendingCount = guests.filter(
    (g) => g.rsvpStatus === "ATTENDING",
  ).length;
  const pendingCount = guests.filter((g) => g.rsvpStatus === "PENDING").length;

  // Hitung Total Pax (Porsi) khusus buat yang HADIR aja
  const totalPaxAttending = guests
    .filter((g) => g.rsvpStatus === "ATTENDING")
    .reduce((sum, g) => sum + g.pax, 0);

  const stats = {
    totalGuests,
    attendingCount,
    pendingCount,
    totalPaxAttending,
  };

  return (
    <GuestListClient guests={guests} stats={stats} weddingId={wedding?.id} />
  );
}
