import { ScrollText } from "lucide-react";
import type { HistoryModule } from "@/lib/prompt";

export function HistoryModuleCard({ module }: { module: HistoryModule }) {
  return (
    <div className="rounded-lg border border-cyan-900/10 bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
        <ScrollText className="h-4 w-4 text-cyan-600" />
        历史课堂工具
      </div>
      <div className="space-y-2">
        {module.timeline.map((item) => (
          <p key={item} className="border-l-2 border-cyan-500 pl-3 text-sm leading-6 text-slate-700">
            {item}
          </p>
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-500">人物：{module.keyFigures.join("、")}</p>
      <p className="mt-3 rounded-md bg-cyan-50 px-3 py-2 text-sm leading-6 text-cyan-950">
        因果：{module.causeEffect}
      </p>
    </div>
  );
}
