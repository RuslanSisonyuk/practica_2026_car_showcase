import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) redirect("/auth/signin");

  return (
    <main className="min-h-screen padding-x padding-y max-width pt-36">
      <h1 className="text-3xl font-extrabold mb-8 mt-20">My Profile</h1>
      <ProfileForm user={user} />
    </main>
  );
}
