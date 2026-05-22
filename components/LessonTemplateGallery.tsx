import { BookOpen, Sparkles } from "lucide-react";
import type { LessonTemplate } from "@/lib/lessonTemplates";

type Props = {
  activeId?: string;
  templates: LessonTemplate[];
  onSelect: (template: LessonTemplate) => void;
};

export function LessonTemplateGallery({ activeId, templates, onSelect }: Props) {
  return (
    <section className="rounded-lg border border-cyan-900/10 bg-slate-950 p-5 text-white shadow-glow">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            AI Classroom Hub
          </p>
          <h2 className="mt-1 text-2xl font-semibold">选择一节 AI 课堂 Demo</h2>
        </div>
        <Sparkles className="h-5 w-5 text-cyan-200" />
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template)}
            className={`rounded-lg border p-4 text-left transition ${
              activeId === template.id
                ? "border-cyan-300 bg-cyan-300/16"
                : "border-white/10 bg-white/8 hover:border-cyan-200/50 hover:bg-white/12"
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="h-4 w-4 text-cyan-200" />
              {template.grade}{template.subject}｜{template.topic}
            </div>
            <p className="mt-3 text-xs leading-5 text-cyan-50/72">
              {template.description}
            </p>
            <p className="mt-3 rounded-md bg-white/8 px-3 py-2 text-xs leading-5 text-cyan-50/78">
              {template.caseProfile.whyGoodForDemo}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold">
              <span className="rounded bg-white/10 px-2 py-1">{template.version}</span>
              <span className="rounded bg-cyan-300/16 px-2 py-1 text-cyan-100">
                {template.recommendedStyle}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {template.caseProfile.aiHighlights.slice(0, 2).map((highlight) => (
                <span
                  key={highlight}
                  className="rounded border border-cyan-200/20 px-2 py-1 text-[11px] text-cyan-100/86"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
