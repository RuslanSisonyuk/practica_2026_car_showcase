"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  _count: { bookmarks: number };
}

export default function AdminTable({
  users: initialUsers,
  currentUserId,
}: {
  users: User[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    setLoading(id);

    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setUsers((prev) => prev.filter((u) => u.id !== id));
    setLoading(null);
  }

  async function handleToggleRole(id: string, currentRole: string) {
    setLoading(id);
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";

    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: newRole }),
    });

    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    }

    setLoading(null);
    router.refresh();
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-left text-grey">
            <th className="py-3 pr-4 font-semibold">Name</th>
            <th className="py-3 pr-4 font-semibold">Email</th>
            <th className="py-3 pr-4 font-semibold">Role</th>
            <th className="py-3 pr-4 font-semibold">Bookmarks</th>
            <th className="py-3 pr-4 font-semibold">Joined</th>
            <th className="py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            const isLoading = loading === user.id;

            return (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 pr-4">{user.name ?? <span className="text-grey italic">—</span>}</td>
                <td className="py-3 pr-4">{user.email}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-primary-blue text-white"
                        : "bg-gray-100 text-grey"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-3 pr-4">{user._count.bookmarks}</td>
                <td className="py-3 pr-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3">
                  {isSelf ? (
                    <span className="text-grey text-xs italic">You</span>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleRole(user.id, user.role)}
                        disabled={isLoading}
                        className="text-xs px-3 py-1 rounded-full border border-primary-blue text-primary-blue hover:bg-blue-50 disabled:opacity-50"
                      >
                        {user.role === "ADMIN" ? "Make User" : "Make Admin"}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={isLoading}
                        className="text-xs px-3 py-1 rounded-full border border-red-400 text-red-500 hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
