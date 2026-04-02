import WeddingSetupClient from "@/components/layout/WeddingSetupClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const WeddingSetupPage = async () => {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  const existingWedding = await prisma.wedding.findFirst({
    where: { userId: session.user.id },
    select: {
      id: true,
      brideName: true,
      groomName: true,
      weddingDate: true,
      totalBudget: true,
    },
  });

  const formattedWedding = existingWedding
    ? {
        id: existingWedding.id,
        brideName: existingWedding.brideName,
        groomName: existingWedding.groomName,
        weddingDate: existingWedding.weddingDate,
        totalBudget: existingWedding.totalBudget
          ? Number(existingWedding.totalBudget)
          : 0,
      }
    : null;

  return (
    <WeddingSetupClient
      userName={session.user.name || "User"}
      weddingData={formattedWedding}
    />
  );
};

export default WeddingSetupPage;
