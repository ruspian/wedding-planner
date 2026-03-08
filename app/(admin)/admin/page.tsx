import AdminDashboardClient from "@/components/layout/AdminDashboardClient";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  // Setup tanggal hari ini buat filter data
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Jalankan query paralel pakai transaction bawaan schema lo
  const [totalUsers, activeWeddingsCount] = await prisma.$transaction([
    // 1. Hitung total semua user di database
    prisma.user.count(),

    // 2. Hitung project pernikahan yang "Aktif"
    // (Asumsinya: Tanggal pernikahannya masih nanti / lebih besar dari hari ini)
    prisma.wedding.count({
      where: {
        weddingDate: {
          gte: today,
        },
      },
    }),
  ]);

  // Siapkan data buat dilempar ke komponen Client
  const serverData = {
    totalUsers: totalUsers,
    activeWeddings: activeWeddingsCount, // Data asli dari tabel Wedding

    // --- Data Placeholder (Karena belum ada di Schema) ---
    // Nanti bisa diganti kalau lo udah nambahin tabel Subscription/Pembayaran
    monthlyRevenue: 0,

    // Nanti bisa diganti kalau lo udah nambahin field `createdAt` di tabel User
    newUsersToday: 0,

    systemStatus: "Healthy",
  };

  return <AdminDashboardClient data={serverData} />;
}
