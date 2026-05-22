import { ClipboardCheck } from "lucide-react";
import type { HomeworkPlan } from "@/lib/prompt";

export function HomeworkPlanCard({ homeworkPlan }: { homeworkPlan: HomeworkPlan }) {
  return (
    <section className="rounded-lg border border-cyan-900/10 bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
        <ClipboardCheck className="h-4 w-4 text-cyan-600" />
        AI 作业建议
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <ListBlock title="基础作业" items={homeworkPlan.basicHomework} />
        <ListBlock title="提高作业" items={homeworkPlan.advancedHomework} />
      </div>
      <p className="mt-3 rounded-md bg-cyan-50 px-3 py-2 text-sm leading-6 text-cyan-950">
        拓展任务：{homeworkPlan.optionalTask}
      </p>
      <p className="mt-2 text-xs font-semibold text-slate-500">
        预计完成时间：{homeworkPlan.estimatedTime}
      </p>
    </section>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs font-semibold text-slate-500">{title}</p>
      <div className="mt-2 space-y-1.5 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <p key={item}>· {item}</p>
        ))}
      </div>
    </div>
  );
}
