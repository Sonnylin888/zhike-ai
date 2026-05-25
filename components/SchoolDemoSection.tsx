import { ArrowRight, CheckCircle2 } from "lucide-react";

const values = [
  "减少重复备课，把时间还给课堂判断",
  "把 PPT、讲稿、板书、互动组织成一套课堂包",
  "教师仍是课堂核心，AI 只做工作台和提示器",
  "支持学校现场稳定演示，不依赖复杂后台"
];

export function SchoolDemoSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-8">
      <div className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
        <div className="grid gap-6 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              School Demo
            </p>
            <h2 className="mt-3 text-3xl font-semibold">面向学校展示的 AI 课堂流程</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              智课 AI 展示的是教师工作流的减负能力：备课更快、上课更稳、互动更清楚、课后更容易复盘。
            </p>
          </div>
          <div className="grid gap-3">
            {values.map((value) => (
              <div key={value} className="flex items-start gap-3 rounded-md border border-white/10 bg-white/8 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                <p className="text-sm leading-6 text-slate-100">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-white/10 px-6 py-4 text-sm font-semibold text-cyan-100 md:px-8">
          AI Teaching Workflow
          <ArrowRight className="h-4 w-4" />
          Future Classroom Experience
        </div>
      </div>
    </section>
  );
}
