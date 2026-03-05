"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export default function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveMsg("");
    setSaveError("");
    setSaving(true);

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setSaveError(data.error || "Failed to save.");
    } else {
      setSaveMsg("Profile updated.");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (deleteEmail !== user.email) {
      setDeleteError("Email does not match.");
      return;
    }

    setDeleting(true);
    await fetch("/api/user", { method: "DELETE" });
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="flex flex-col gap-10 max-w-md">
      {/* Edit form */}
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-grey">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-grey">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="custom-btn bg-primary-blue text-white rounded-full px-6 py-2 font-bold disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {saveMsg && <span className="text-green-600 text-sm">{saveMsg}</span>}
          {saveError && <span className="text-red-500 text-sm">{saveError}</span>}
        </div>
      </form>

      {/* Delete account */}
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-lg font-bold text-red-600 mb-2">Delete Account</h2>
        <p className="text-sm text-grey mb-4">
          This will permanently delete your account and all your bookmarks.
        </p>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="custom-btn border border-red-500 text-red-500 rounded-full px-6 py-2 font-bold hover:bg-red-50"
          >
            Delete My Account
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">
              Type your email <strong>{user.email}</strong> to confirm:
            </p>
            <input
              type="email"
              value={deleteEmail}
              onChange={(e) => setDeleteEmail(e.target.value)}
              className="border border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            {deleteError && <p className="text-red-500 text-sm">{deleteError}</p>}
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="custom-btn bg-red-500 text-white rounded-full px-6 py-2 font-bold disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Confirm Delete"}
              </button>
              <button
                onClick={() => { setConfirmDelete(false); setDeleteEmail(""); setDeleteError(""); }}
                className="custom-btn border border-gray-300 text-grey rounded-full px-6 py-2 font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
