import { ArrowRight, Gauge } from "lucide-react";
import { valueMetrics } from "@/lib/cooperation";

export function ValueMetrics() {
  return (
    <section className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
          Value Metrics
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">AI 课堂价值指标</h2>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {valueMetrics.map((metric) => (
          <article key={metric.label} className="rounded-lg bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-950">{metric.label}</h3>
              <Gauge className="h-4 w-4 text-cyan-600" />
            </div>
            <div className="space-y-3 text-sm leading-6">
              <p className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-600">
                之前：{metric.before}
              </p>
              <div className="flex justify-center text-cyan-600">
                <ArrowRight className="h-4 w-4" />
              </div>
              <p className="rounded-md bg-slate-950 px-3 py-2 font-medium text-cyan-50">
                之后：{metric.after}
              </p>
              <p className="text-xs font-medium text-slate-500">{metric.note}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
