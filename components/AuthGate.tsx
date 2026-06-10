"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, type ZhikeUser } from "@/lib/auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<ZhikeUser | null | undefined>(undefined);

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    if (!current) router.replace("/login");
  }, [router]);

  if (user === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-lg border border-white/10 bg-white/8 px-5 py-4 text-sm">
          正在进入智课 AI...
        </div>
      </main>
    );
  }

  if (!user) return null;
  return <>{children}</>;
}
