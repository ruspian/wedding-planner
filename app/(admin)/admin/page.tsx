import AdminDashboardClient from "@/components/layout/AdminDashboardClient";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  //tanggal hari ini
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // tanggal 1 bulan ini
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [totalUsers, newUsersToday, activeWeddingsCount, monthlyTransactions] =
    await prisma.$transaction([
      prisma.user.count(),

      prisma.user.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      }),

      // tanggal wedding masih lama
      prisma.wedding.count({
        where: {
          weddingDate: {
            gte: today,
          },
        },
      }),

      // 4. Ambil semua transaksi sukses bulan ini buat dihitung
      prisma.transaction.findMany({
        where: {
          status: "SUCCESS",
          createdAt: {
            gte: firstDayOfMonth,
          },
        },
        select: {
          amount: true,
        },
      }),
    ]);

  // Hitung total pendapatan (Revenue) bulan ini pakai data dari transaksi DB
  const monthlyRevenue = monthlyTransactions.reduce(
    (total, trx) => total + Number(trx.amount), // Konversi Decimal Prisma ke Number JS
    0,
  );

  const serverData = {
    totalUsers: totalUsers,
    activeWeddings: activeWeddingsCount,
    monthlyRevenue: monthlyRevenue,
    newUsersToday: newUsersToday,
    systemStatus: "Healthy",
  };

  return <AdminDashboardClient data={serverData} />;
}
