import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let initialItems = [];
  let loadError = false;

  try {
    const items = await prisma.item.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      take: 60,
    });
    initialItems = items.map((item) => ({
      ...item,
      itemDate: item.itemDate.toISOString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  } catch (error) {
    loadError = true;
  }

  return <HomeClient initialItems={initialItems} loadError={loadError} />;
}