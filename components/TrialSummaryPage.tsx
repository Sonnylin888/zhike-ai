import { ClipboardCheck, TimerReset } from "lucide-react";
import { trialSummaryHighlights } from "@/lib/trialMode";
import type { TeachingPlan } from "@/lib/prompt";

type Props = {
  plan: TeachingPlan;
};

export function TrialSummaryPage({ plan }: Props) {
  const totalInteractions =
    plan.lessonSummary?.totalInteractions ||
    plan.slides.reduce((sum, slide) => sum + slide.interactionCount, 0);

  return (
    <section
      id="trial-summary"
      className="rounded-lg border border-white/10 bg-slate-950 p-5 text-white shadow-glow"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Trial Summary
          </p>
          <h2 className="mt-1 text-2xl font-semibold">试讲结束页</h2>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-cyan-300 px-3 py-2 text-sm font-bold text-slate-950">
          <TimerReset className="h-4 w-4" />
          {plan.lessonSummary?.totalDuration || "40分钟"} 课堂包
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border border-white/10 bg-white/8 p-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <ClipboardCheck className="h-5 w-5 text-cyan-200" />
            本节试讲生成了什么
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {trialSummaryHighlights.map((item) => (
              <p key={item} className="rounded-md bg-white/8 px-3 py-2 text-sm leading-6 text-cyan-50/78">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/8 p-4">
          <h3 className="text-lg font-semibold">课堂互动亮点</h3>
          <p className="mt-3 text-4xl font-semibold text-cyan-200">
            {totalInteractions} 次
          </p>
          <p className="mt-2 text-sm leading-6 text-cyan-50/72">
            覆盖提问、讨论、小测验和举手互动，老师仍然控制课堂节奏。
          </p>
          <a
            href="#trial-feedback"
            className="mt-4 inline-flex rounded-md bg-cyan-300 px-3 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-200"
          >
            填写试讲反馈
          </a>
        </div>
      </div>
    </section>
  );
}
