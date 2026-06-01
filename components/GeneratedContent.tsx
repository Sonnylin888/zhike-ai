import type { ClassroomPackage } from "@/lib/classroomPackage";

export function GeneratedContent({ classroomPackage }: { classroomPackage: ClassroomPackage }) {
  return (
    <section className="rounded-lg border border-cyan-200 bg-cyan-50/70 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
        AI Generated Content
      </p>
      <h2 className="mt-1 text-xl font-semibold text-slate-950">{classroomPackage.title}</h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
        {classroomPackage.lessonPlan || "AI 已生成课堂内容，可继续查看下方课堂包。"}
      </p>
    </section>
  );
}
