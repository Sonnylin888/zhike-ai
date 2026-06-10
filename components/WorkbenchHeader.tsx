"use client";

import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UsageBadge } from "@/components/UsageBadge";
import { WatermarkBadge } from "@/components/WatermarkBadge";
import { getCurrentUser, isAdmin, logout, type ZhikeUser } from "@/lib/auth";

export function WorkbenchHeader() {
  const router = useRouter();
  const [user, setUser] = useState<ZhikeUser | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    function refresh() {
      setUser(getCurrentUser());
    }
    window.addEventListener("zhike-usage-changed", refresh);
    window.addEventListener("zhike-auth-changed", refresh);
    return () => {
      window.removeEventListener("zhike-usage-changed", refresh);
      window.removeEventListener("zhike-auth-changed", refresh);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="sticky top-0 z-50 border-b border-cyan-900/10 bg-white/90 px-4 py-3 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">{user.displayName}</p>
          <p className="text-xs text-slate-500">角色：{user.role}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <UsageBadge user={user} />
          <WatermarkBadge watermark={user.watermark} />
          {isAdmin(user) ? (
            <Button asChild type="button" variant="secondary" size="sm">
              <Link href="/admin">
                <Settings className="h-4 w-4" />
                后台
              </Link>
            </Button>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
            退出
          </Button>
        </div>
      </div>
    </div>
  );
}
