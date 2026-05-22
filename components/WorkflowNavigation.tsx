import { ArrowDown, Clock3 } from "lucide-react";

const navItems = [
  { href: "#before-class", label: "课前" },
  { href: "#in-class", label: "课中" },
  { href: "#after-class", label: "课后" }
];

export function WorkflowNavigation() {
  return (
    <nav className="sticky top-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-cyan-900/10 bg-white/90 px-4 py-3 shadow-[0_14px_36px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
        <Clock3 className="h-4 w-4 text-cyan-600" />
        AI 课堂工作流
      </div>
      <div className="flex gap-2">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="inline-flex items-center gap-1.5 rounded-md bg-slate-950 px-3 py-1.5 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-700"
          >
            {item.label}
            <ArrowDown className="h-3 w-3" />
          </a>
        ))}
      </div>
    </nav>
  );
}
