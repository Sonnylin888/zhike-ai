import { GraduationCap, ShieldCheck } from "lucide-react";
import { schoolValues } from "@/lib/trialMode";

export function SchoolValueCards() {
  return (
    <section className="rounded-lg border border-white/10 bg-slate-950 p-5 text-white shadow-glow">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            School Value
          </p>
          <h2 className="mt-1 text-2xl font-semibold">学校现场能看懂的价值</h2>
        </div>
        <ShieldCheck className="h-5 w-5 text-cyan-200" />
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {schoolValues.map((item) => (
          <div key={item.title} className="rounded-lg border border-white/10 bg-white/8 p-4">
            <GraduationCap className="h-5 w-5 text-cyan-200" />
            <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-cyan-50/72">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
