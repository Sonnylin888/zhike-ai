import { Languages } from "lucide-react";
import type { EnglishModule } from "@/lib/prompt";

export function EnglishModuleCard({ module }: { module: EnglishModule }) {
  return (
    <div className="rounded-lg border border-cyan-900/10 bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
        <Languages className="h-4 w-4 text-cyan-600" />
        英语课堂工具
      </div>
      <div className="flex flex-wrap gap-2">
        {module.vocabulary.map((word) => (
          <span key={word} className="rounded bg-cyan-50 px-2.5 py-1 text-sm font-semibold text-cyan-800">
            {word}
          </span>
        ))}
      </div>
      <p className="mt-3 rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-cyan-50">
        {module.sentencePattern}
      </p>
      <p className="mt-3 text-sm text-slate-600">口语任务：{module.speakingTask}</p>
      <div className="mt-3 space-y-1.5 text-sm leading-6 text-slate-700">
        {module.dialogue.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}
