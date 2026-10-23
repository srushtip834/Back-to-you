import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const allowedTypes = ["LOST", "FOUND"];
const allowedCategories = ["ID / Cards", "Electronics", "Bags", "Books", "Clothing", "Keys", "Accessories", "Other"];

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = clean(searchParams.get("q")).slice(0, 100);
  const type = clean(searchParams.get("type")).toUpperCase();
  const category = clean(searchParams.get("category"));
  const where = { status: "OPEN" };

  if (allowedTypes.includes(type)) where.type = type;
  if (allowedCategories.includes(category)) where.category = category;
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { location: { contains: q } },
    ];
  }

  try {
    const items = await prisma.item.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Could not load items." }, { status: 500 });
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const title = clean(body.title);
  const type = clean(body.type).toUpperCase();
  const category = clean(body.category);
  const description = clean(body.description);
  const location = clean(body.location);
  const itemDate = clean(body.itemDate);
  const contactEmail = clean(body.contactEmail).toLowerCase();
  const imageUrl = clean(body.imageUrl);

  if (!title || title.length > 100) return NextResponse.json({ error: "Enter an item name (max 100 characters)." }, { status: 400 });
  if (!allowedTypes.includes(type)) return NextResponse.json({ error: "Choose Lost or Found." }, { status: 400 });
  if (!allowedCategories.includes(category)) return NextResponse.json({ error: "Choose a valid category." }, { status: 400 });
  if (!description || description.length > 1000) return NextResponse.json({ error: "Description is required (max 1000 characters)." }, { status: 400 });
  if (!location || location.length > 150) return NextResponse.json({ error: "Enter a location (max 150 characters)." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) || contactEmail.length > 254) return NextResponse.json({ error: "Enter a valid contact email." }, { status: 400 });
  const parsedDate = new Date(itemDate);
  if (!itemDate || Number.isNaN(parsedDate.getTime())) return NextResponse.json({ error: "Choose a valid date." }, { status: 400 });
  if (imageUrl && (!/^https?:\/\//i.test(imageUrl) || imageUrl.length > 500)) return NextResponse.json({ error: "Image must be a valid http(s) URL." }, { status: 400 });

  try {
    const item = await prisma.item.create({
      data: { title, type, category, description, location, itemDate: parsedDate, contactEmail, imageUrl: imageUrl || null },
    });
    return NextResponse.json({
      ...item,
      itemDate: item.itemDate.toISOString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not save this report. Check your database setup." }, { status: 500 });
  }
}