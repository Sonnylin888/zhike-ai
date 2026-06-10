"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "系统概览" },
  { href: "/admin/users", label: "账号管理" },
  { href: "/admin/models", label: "模型配置" },
  { href: "/admin/api-keys", label: "API Key" },
  { href: "/admin/usage", label: "使用次数" }
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="rounded-lg border border-white/10 bg-slate-950 p-3 text-white">
      <p className="px-3 py-2 text-sm font-semibold text-cyan-100">智课 AI 后台</p>
      <nav className="mt-2 grid gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              pathname === item.href ? "bg-cyan-300 text-slate-950" : "text-slate-300 hover:bg-white/10"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
