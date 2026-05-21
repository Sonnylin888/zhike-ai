import { Clock3, Gauge } from "lucide-react";
import type { Slide } from "@/lib/prompt";

export function PaceControlCard({ slide }: { slide: Slide }) {
  return (
    <section className="rounded-lg border border-cyan-900/10 bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
        <Gauge className="h-4 w-4 text-cyan-600" />
        课堂节奏
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-slate-950 p-3 text-white">
          <p className="flex items-center gap-1.5 text-xs text-cyan-100">
            <Clock3 className="h-3.5 w-3.5" />
            总时长
          </p>
          <p className="mt-1 text-lg font-semibold">{slide.paceControl.duration}</p>
        </div>
        <div className="rounded-md bg-cyan-50 p-3">
          <p className="text-xs text-cyan-700">互动类型</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">
            {slide.paceControl.interactionType}
          </p>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-xs text-slate-500">讲解时间</p>
          <p className="mt-1 font-semibold text-slate-950">
            {slide.paceControl.explainTime}
          </p>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-xs text-slate-500">互动时间</p>
          <p className="mt-1 font-semibold text-slate-950">
            {slide.paceControl.questionTime}
          </p>
        </div>
      </div>
      <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
        {slide.paceControl.paceWarning}
      </p>
    </section>
  );
}
