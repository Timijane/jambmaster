"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type AdminProfile = {
  email: string;
  role: string;
  active: boolean;
};

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/admin/login");
        return;
      }

      setUser(currentUser);

      try {
        const adminRef = doc(db, "adminUsers", currentUser.uid);
        const adminSnapshot = await getDoc(adminRef);

        if (!adminSnapshot.exists()) {
          await signOut(auth);
          router.replace("/admin/login?error=unauthorized");
          return;
        }

        const adminData = adminSnapshot.data() as AdminProfile;

        if (!adminData.active) {
          await signOut(auth);
          router.replace("/admin/login?error=disabled");
          return;
        }

        setAdmin(adminData);
        setChecking(false);
      } catch (error) {
        console.error("Admin authorization error:", error);

        await signOut(auth);
        router.replace("/admin/login?error=authorization");
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function handleLogout() {
    await signOut(auth);
    router.replace("/admin/login");
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5ff]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-700" />

          <p className="font-semibold text-violet-700">
            Securing JAMBMASTER Admin...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ff]">
      <header className="border-b border-violet-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-black text-gray-950">
              JAMBMASTER
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-10">
          <p className="text-sm font-medium text-gray-500">
            Welcome back, {admin?.role === "super_admin" ? "Super Admin" : "Admin"}
          </p>

          <h2 className="mt-1 text-3xl font-black tracking-tight text-gray-950">
            Admin Dashboard
          </h2>

          <p className="mt-3 max-w-2xl text-gray-600">
            Manage JAMBMASTER content, design, media, students,
            academic resources and platform settings from one place.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AdminCard
            title="Homepage"
            description="Edit homepage sections, text, buttons and visibility."
          />

          <AdminCard
            title="Announcements"
            description="Manage moving announcements and important updates."
          />

          <AdminCard
            title="Media Manager"
            description="Upload and manage JAMBMASTER images and media."
          />

          <AdminCard
            title="Blog"
            description="Create, edit and publish educational articles."
          />

          <AdminCard
            title="Design"
            description="Control colors, typography, spacing and visual settings."
          />

          <AdminCard
            title="Site Settings"
            description="Manage logo, slogan, footer, SEO and global settings."
          />
        </div>

        <div className="mt-10 rounded-2xl border border-violet-100 bg-white p-6">
          <p className="text-sm text-gray-500">
            Signed in as
          </p>

          <p className="mt-1 font-bold text-gray-900">
            {user?.email}
          </p>

          <div className="mt-4 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
            {admin?.role}
          </div>
        </div>
      </section>

      <footer className="border-t border-violet-100 bg-white py-6 text-center">
        <p className="text-xs text-gray-400">
          JAMBMASTER · Managed by Triangletech
        </p>
      </footer>
    </main>
  );
}

function AdminCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 font-black text-violet-700">
        {title.charAt(0)}
      </div>

      <h3 className="text-lg font-black text-gray-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}
