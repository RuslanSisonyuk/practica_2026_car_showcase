import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminTable from "./AdminTable";

export default async function AdminPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { bookmarks: true } },
    },
  });

  return (
    <main className="min-h-screen padding-x padding-y max-width pt-36">
      <div className="home__text-container mb-8 mt-20">
        <h1 className="text-4xl font-extrabold">Admin Panel</h1>
        <p>{users.length} registered user{users.length !== 1 ? "s" : ""}</p>
      </div>
      <AdminTable users={users} currentUserId={session.user.id} />
    </main>
  );
}
