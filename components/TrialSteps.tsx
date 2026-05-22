import { CheckCircle2 } from "lucide-react";
import { trialSteps } from "@/lib/trialMode";

export function TrialSteps() {
  return (
    <section className="rounded-lg border border-cyan-900/10 bg-white/92 p-5 shadow-glow backdrop-blur">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
          School Trial Flow
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">学校试讲流程</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {trialSteps.map((step, index) => (
          <div
            key={step.title}
            className="relative rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Step {String(index + 1).padStart(2, "0")}
              </span>
              <CheckCircle2 className="h-4 w-4 text-cyan-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-950">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
