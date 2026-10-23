import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Demo workflow: a report owner can mark an item returned from the interface.
// Add authentication and authorization before exposing this endpoint publicly.
export async function PATCH(request, { params }) {
  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.confirm !== true) {
    return NextResponse.json({ error: "Confirmation is required." }, { status: 400 });
  }

  try {
    const item = await prisma.item.update({
      where: { id },
      data: { status: "RETURNED" },
    });
    return NextResponse.json({ id: item.id, status: item.status });
  } catch {
    return NextResponse.json({ error: "Item not found or already updated." }, { status: 404 });
  }
}