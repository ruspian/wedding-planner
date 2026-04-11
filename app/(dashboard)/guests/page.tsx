import GuestListClient from "@/components/layout/GuestListClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function GuestListPage() {
  const session = await auth();
  if (!session || !session.user) redirect("/login");

  const wedding = await prisma.wedding.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!wedding) redirect("/dashboard/setup");

  const guests = await prisma.guest.findMany({
    where: { weddingId: wedding.id },
    orderBy: { id: "desc" },
  });

  const totalGuests = guests.length;
  const totalEstimatedPax = guests.reduce((sum, g) => sum + g.pax, 0);

  const stats = { totalGuests, totalEstimatedPax };

  return (
    <GuestListClient guests={guests} stats={stats} weddingId={wedding.id} />
  );
}
