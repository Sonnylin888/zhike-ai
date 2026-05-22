import { RotateCcw } from "lucide-react";
import type { TeachingReflection } from "@/lib/prompt";

export function TeachingReflectionCard({
  reflection
}: {
  reflection: TeachingReflection;
}) {
  return (
    <section className="rounded-lg border border-cyan-900/10 bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
        <RotateCcw className="h-4 w-4 text-cyan-600" />
        教师复盘建议
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <MiniList title="可能问题" items={reflection.possibleProblems} />
        <MiniList title="调整建议" items={reflection.adjustmentSuggestions} />
        <MiniList title="学生误区" items={reflection.studentMisconceptions} />
      </div>
      <p className="mt-3 rounded-md bg-slate-950 px-3 py-2 text-sm leading-6 text-cyan-50">
        补讲建议：{reflection.reteachSuggestion}
      </p>
    </section>
  );
}

function MiniList({ title, items }: { title: string; items: string[] }) {
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
