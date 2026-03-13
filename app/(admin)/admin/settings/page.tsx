import AdminSettingsClient from "@/components/layout/AdminSettingsClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const adminData = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    select: { id: true, name: true, email: true },
  });

  if (!adminData) {
    redirect("/");
  }

  return <AdminSettingsClient adminData={adminData} />;
}
