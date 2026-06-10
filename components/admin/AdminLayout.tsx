"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { getCurrentUser, isAdmin, logout, type ZhikeUser } from "@/lib/auth";

export function AdminLayout({
  children,
  title,
  description
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
}) {
  const router = useRouter();
  const [user, setUser] = useState<ZhikeUser | null | undefined>(undefined);

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    if (!current) router.replace("/login");
    if (current && !isAdmin(current)) router.replace("/");
  }, [router]);

  if (user === undefined || !user || !isAdmin(user)) {
    return <main className="min-h-screen bg-slate-100 p-6 text-slate-600">正在验证后台权限...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-cyan-700">Admin Console</p>
              <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
              {description ? (
                <p className="mt-1 text-sm text-slate-500">{description}</p>
              ) : null}
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                logout();
                router.replace("/login");
              }}
            >
              退出登录
            </Button>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
