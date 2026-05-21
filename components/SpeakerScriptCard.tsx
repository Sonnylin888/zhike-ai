import { AlertTriangle, ClipboardList, MessageCircleQuestion } from "lucide-react";
import type { Slide } from "@/lib/prompt";

export function SpeakerScriptCard({ slide }: { slide: Slide }) {
  return (
    <section className="rounded-lg border border-cyan-900/10 bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
        <ClipboardList className="h-4 w-4 text-cyan-600" />
        AI 课堂讲稿
      </div>
      <div className="space-y-3 text-sm leading-6 text-slate-700">
        <p>
          <span className="font-semibold text-slate-950">开场：</span>
          {slide.speakerScript.opening}
        </p>
        <p>
          <span className="font-semibold text-slate-950">讲解：</span>
          {slide.speakerScript.explanation}
        </p>
        <p>
          <span className="font-semibold text-slate-950">过渡：</span>
          {slide.speakerScript.transition}
        </p>
      </div>

      <div className="mt-4 rounded-md border border-slate-800 bg-slate-950 p-3 text-cyan-50">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
          板书提示
        </p>
        <div className="mt-2 space-y-1.5 text-sm">
          {slide.boardWriting.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-md bg-amber-50 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5" />
            易错提醒
          </div>
          <div className="space-y-1.5 text-sm leading-6 text-amber-900">
            {slide.speakerScript.commonMistakes.map((item) => (
              <p key={item}>· {item}</p>
            ))}
          </div>
        </div>
        <div className="rounded-md bg-cyan-50 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-cyan-800">
            <MessageCircleQuestion className="h-3.5 w-3.5" />
            追问引导
          </div>
          <p className="text-sm leading-6 text-cyan-950">
            {slide.questionGuide.followUpQuestion}
          </p>
          <p className="mt-2 text-xs leading-5 text-cyan-800">
            {slide.questionGuide.expectedAnswer}
          </p>
        </div>
      </div>
    </section>
  );
}
