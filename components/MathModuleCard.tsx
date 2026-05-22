import { Sigma } from "lucide-react";
import type { MathModule } from "@/lib/prompt";

export function MathModuleCard({ module }: { module: MathModule }) {
  return (
    <div className="rounded-lg border border-cyan-900/10 bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
        <Sigma className="h-4 w-4 text-cyan-600" />
        数学课堂工具
      </div>
      <p className="rounded-md bg-slate-950 px-3 py-2 text-lg font-semibold text-cyan-50">
        {module.formula}
      </p>
      <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        {module.steps.map((step, index) => (
          <li key={step} className="flex gap-2">
            <span className="font-semibold text-cyan-700">{index + 1}.</span>
            {step}
          </li>
        ))}
      </ol>
      <p className="mt-3 rounded-md bg-cyan-50 px-3 py-2 text-sm text-cyan-950">
        例题：{module.exampleProblem}
      </p>
      <p className="mt-2 text-sm text-slate-500">{module.solutionHint}</p>
    </div>
  );
}
