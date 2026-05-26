import { BookOpenCheck } from "lucide-react";
import { SitePageShell } from "@/components/SitePageShell";

export default function LessonPage() {
  return (
    <SitePageShell
      eyebrow="AI Lesson Plan"
      title="AI 教案演示"
      description="围绕课前准备、课中讲稿、板书建议和课后复盘，形成老师可直接使用的课堂包。"
    >
      <div className="grid gap-3 md:grid-cols-4">
        {["教学目标", "课堂流程", "教师讲稿", "课后复盘"].map((item) => (
          <article key={item} className="rounded-lg bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <BookOpenCheck className="h-5 w-5 text-cyan-600" />
            <h2 className="mt-4 font-semibold text-slate-950">{item}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              内容简洁、可检查、可调整，AI 辅助教师而不是替代教师。
            </p>
          </article>
        ))}
      </div>
    </SitePageShell>
  );
}
