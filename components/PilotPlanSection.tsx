import { CalendarDays, CheckCircle2 } from "lucide-react";
import { pilotPlan } from "@/lib/pilotPlan";

export function PilotPlanSection() {
  return (
    <section className="rounded-lg border border-white/10 bg-slate-950 p-5 text-white shadow-glow">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Pilot Plan
          </p>
          <h2 className="mt-1 text-2xl font-semibold">4 周学校试点方案</h2>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-cyan-300 px-3 py-2 text-sm font-bold text-slate-950">
          <CalendarDays className="h-4 w-4" />
          只做试点展示，不做项目管理
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {pilotPlan.map((week) => (
          <article key={week.week} className="rounded-lg border border-white/10 bg-white/8 p-4">
            <p className="text-sm font-semibold text-cyan-200">{week.week}</p>
            <h3 className="mt-2 text-lg font-semibold">{week.theme}</h3>
            <div className="mt-4 space-y-2">
              {week.tasks.map((task) => (
                <p key={task} className="flex gap-2 text-sm leading-6 text-cyan-50/78">
                  <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-cyan-200" />
                  {task}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
