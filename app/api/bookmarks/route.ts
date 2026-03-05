import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, make: true, model: true, year: true },
  });

  return NextResponse.json(bookmarks);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { make, model, year } = await req.json();

  const bookmark = await prisma.bookmark.upsert({
    where: { userId_make_model_year: { userId: session.user.id, make, model, year } },
    create: { userId: session.user.id, make, model, year },
    update: {},
  });

  return NextResponse.json(bookmark, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { make, model, year } = await req.json();

  await prisma.bookmark.deleteMany({
    where: { userId: session.user.id, make, model, year },
  });

  return NextResponse.json({ ok: true });
}
