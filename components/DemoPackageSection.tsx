import { Boxes, CheckCircle2 } from "lucide-react";
import { demoPackageItems } from "@/lib/cooperation";

export function DemoPackageSection() {
  return (
    <section className="rounded-lg border border-cyan-900/10 bg-white/92 p-5 shadow-glow backdrop-blur">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
            Demo Package
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">合作演示包</h2>
        </div>
        <Boxes className="h-5 w-5 text-cyan-600" />
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {demoPackageItems.map((item) => (
          <div key={item} className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-600" />
            <span className="text-sm font-semibold text-slate-700">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
