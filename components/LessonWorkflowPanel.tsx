import { BookOpenCheck, Presentation, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { AfterClassSummary, LessonWorkflow } from "@/lib/prompt";

export function LessonWorkflowPanel({
  workflow,
  afterClassSummary
}: {
  workflow: LessonWorkflow;
  afterClassSummary: AfterClassSummary;
}) {
  return (
    <section className="space-y-4">
      <div id="before-class" className="scroll-mt-24 rounded-lg border border-cyan-900/10 bg-white p-5">
        <Header icon={<BookOpenCheck className="h-4 w-4 text-cyan-600" />} label="课前准备" />
        <p className="mt-3 text-lg font-semibold text-slate-950">
          {workflow.beforeClass.lessonGoal}
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <List title="教学重点" items={workflow.beforeClass.keyPoints} />
          <List title="准备材料" items={workflow.beforeClass.materials} />
          <List title="教师准备" items={workflow.beforeClass.teacherPreparation} />
        </div>
      </div>

      <div id="in-class" className="scroll-mt-24 rounded-lg border border-cyan-900/10 bg-slate-950 p-5 text-white">
        <Header icon={<Presentation className="h-4 w-4 text-cyan-200" />} label="课中教学" dark />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <List title="教学流程" items={workflow.inClass.teachingFlow} dark />
          <List title="互动节点" items={workflow.inClass.interactionMoments} dark />
          <div className="rounded-md border border-white/10 bg-white/8 p-3">
            <p className="text-xs font-semibold text-cyan-100">节奏安排</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              {workflow.inClass.pacePlan}
            </p>
          </div>
        </div>
      </div>

      <div id="after-class" className="scroll-mt-24 rounded-lg border border-cyan-900/10 bg-white p-5">
        <Header icon={<Sparkles className="h-4 w-4 text-cyan-600" />} label="课后总结" />
        <p className="mt-3 text-base leading-7 text-slate-700">
          {afterClassSummary.classSummary}
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <List title="学生收获" items={afterClassSummary.studentTakeaways} />
          <div className="rounded-md bg-cyan-50 p-3">
            <p className="text-xs font-semibold text-cyan-700">教师复盘</p>
            <p className="mt-2 text-sm leading-6 text-cyan-950">
              {afterClassSummary.teacherReflection}
            </p>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-500">下一课衔接</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {afterClassSummary.nextLessonSuggestion}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Header({
  icon,
  label,
  dark = false
}: {
  icon: ReactNode;
  label: string;
  dark?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 text-sm font-semibold ${dark ? "text-white" : "text-slate-950"}`}>
      {icon}
      {label}
    </div>
  );
}

function List({
  title,
  items,
  dark = false
}: {
  title: string;
  items: string[];
  dark?: boolean;
}) {
  return (
    <div className={dark ? "rounded-md border border-white/10 bg-white/8 p-3" : "rounded-md bg-slate-50 p-3"}>
      <p className={dark ? "text-xs font-semibold text-cyan-100" : "text-xs font-semibold text-slate-500"}>
        {title}
      </p>
      <div className={dark ? "mt-2 space-y-1.5 text-sm leading-6 text-slate-200" : "mt-2 space-y-1.5 text-sm leading-6 text-slate-700"}>
        {items.map((item) => (
          <p key={item}>· {item}</p>
        ))}
      </div>
    </div>
  );
}
