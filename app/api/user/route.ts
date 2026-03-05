import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email } = await req.json();

  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const existing = await prisma.user.findFirst({
    where: { email, NOT: { id: session.user.id } },
  });
  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { name: name || null, email },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.user.delete({ where: { id: session.user.id } });

  return NextResponse.json({ ok: true });
}
