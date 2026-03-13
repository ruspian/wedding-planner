import AdminTransactionsClient from "@/components/layout/AdminTransactionsClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SearchParamsType } from "@/types/admin.transaction";
import { redirect } from "next/navigation";

export default async function AdminTransactionsPage({
  searchParams,
}: SearchParamsType) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const params = await searchParams;
  const search = params.search || "";
  const page = Math.max(1, parseInt(params.page || "1"));
  const limit = 10;

  const whereClause = search
    ? {
        OR: [
          { id: { contains: search, mode: "insensitive" as const } },
          {
            user: {
              name: { contains: search, mode: "insensitive" as const },
            },
          },
        ],
      }
    : {};

  const [transactions, totalTransactions] = await prisma.$transaction([
    prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    }),
    prisma.transaction.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalTransactions / limit);

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // pembayaran sukses bulan ini
  const monthlyTransactions = await prisma.transaction.findMany({
    where: { status: "SUCCESS", createdAt: { gte: firstDayOfMonth } },
    select: { amount: true },
  });
  const monthlyRevenue = monthlyTransactions.reduce(
    (total, trx) => total + Number(trx.amount),
    0,
  );

  // pembayaran pending bulan ini
  const pendingTransactions = await prisma.transaction.findMany({
    where: { status: "PENDING" },
    select: { amount: true },
  });
  const pendingRevenue = pendingTransactions.reduce(
    (total, trx) => total + Number(trx.amount),
    0,
  );

  // pembayaran gagal bulan ini
  const failedTransactions = await prisma.transaction.findMany({
    where: { status: "FAILED" },
    select: { amount: true },
  });
  const failedRevenue = failedTransactions.reduce(
    (total, trx) => total + Number(trx.amount),
    0,
  );

  const formattedTransactions = transactions.map((trx) => ({
    id: trx.id,
    date: new Date(trx.createdAt).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    userName: trx.user?.name || "User Tidak Dikenal",
    packageName: trx.packageName,
    amount: Number(trx.amount),
    method: trx.method || "Belum Dipilih",
    status: trx.status,
  }));

  const stats = {
    monthlyRevenue,
    pendingRevenue,
    failedRevenue,
  };

  return (
    <AdminTransactionsClient
      transactions={formattedTransactions}
      stats={stats}
      totalPages={totalPages}
      currentPage={page}
      totalItems={totalTransactions}
    />
  );
}
