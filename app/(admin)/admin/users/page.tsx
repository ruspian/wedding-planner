import AdminUsersClient from "@/components/layout/AdminUsersClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface SearchParamsType {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function AdminUsersPage({
  searchParams,
}: SearchParamsType) {
  const session = await auth();
  const params = await searchParams;

  const search = params.search || "";
  const page = Math.max(1, parseInt(params?.page as string) || 1);
  const limit = 10;

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const whereClause = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } as const },
          { email: { contains: search, mode: "insensitive" } as const },
        ],
      }
    : {};

  const [users, totalUsers] = await prisma.$transaction([
    prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,

      include: {
        weddings: {
          select: { weddingDate: true },
          take: 1,
        },
        transactions: {
          select: { status: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.user.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  const formatedUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    weddingDate: user.weddings[0]?.weddingDate
      ? new Date(user.weddings[0].weddingDate).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "Belum Diatur",
    status: user.transactions[0]?.status || "PENDING",
    plan: "Premium",
    isSuspended: user.isSuspended,
  }));

  return (
    <AdminUsersClient
      totalPages={totalPages}
      currentPage={page}
      totalUsers={totalUsers}
      usersData={formatedUsers}
    />
  );
}
