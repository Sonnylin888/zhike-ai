import { Activity, MessageCircleQuestion, PenLine, Target } from "lucide-react";
import type { ReactNode } from "react";
import type { Slide, TeachingPlan } from "@/lib/prompt";

export function TeachingConsole({
  plan,
  currentSlide
}: {
  plan: TeachingPlan;
  currentSlide: Slide;
}) {
  const consoleState = {
    currentStage: currentSlide.title,
    currentGoal:
      plan.lessonWorkflow?.beforeClass.lessonGoal || currentSlide.speakerAssistant.keyPoints[0],
    interactionSuggestion: currentSlide.questionGuide.followUpQuestion,
    boardWriting: currentSlide.boardWriting,
    pacing: `建议讲解 ${currentSlide.paceControl.explainTime}，互动 ${currentSlide.paceControl.questionTime}`
  };

  return (
    <section className="rounded-lg border border-cyan-900/10 bg-slate-950 p-5 text-white shadow-[0_18px_54px_rgba(15,23,42,0.18)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Teaching Console
          </p>
          <h3 className="mt-1 text-2xl font-semibold">AI 教学中控台</h3>
        </div>
        <Activity className="h-5 w-5 text-cyan-200" />
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <ConsoleItem icon={<Target className="h-4 w-4" />} label="当前目标" value={consoleState.currentGoal} />
        <ConsoleItem icon={<Activity className="h-4 w-4" />} label="当前节奏" value={consoleState.pacing} />
        <ConsoleItem icon={<MessageCircleQuestion className="h-4 w-4" />} label="互动建议" value={consoleState.interactionSuggestion} />
        <ConsoleItem icon={<PenLine className="h-4 w-4" />} label="板书建议" value={consoleState.boardWriting.join(" / ")} />
      </div>
    </section>
  );
}

function ConsoleItem({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/8 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-cyan-100">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-100">{value}</p>
    </div>
  );
}
