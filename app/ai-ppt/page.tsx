import { MonitorPlay, Presentation } from "lucide-react";
import { SitePageShell } from "@/components/SitePageShell";

export default function AIPptPage() {
  return (
    <SitePageShell
      eyebrow="AI PPT Demo"
      title="AI PPT 演示"
      description="展示智课如何把教学主题拆成可翻页、可全屏、可互动的课堂 Slide。"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {["页面化 PPT", "全屏演示", "AI 配图", "课堂互动"].map((item) => (
          <article key={item} className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-glow">
            <Presentation className="h-5 w-5 text-cyan-600" />
            <h2 className="mt-4 text-xl font-semibold text-slate-950">{item}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              适合教室大屏和投影场景，保留教师主导权，AI 负责减少重复准备。
            </p>
          </article>
        ))}
      </div>
      <a
        href="/#agency-demo-mode"
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
      >
        <MonitorPlay className="h-4 w-4" />
        开始课堂演示
      </a>
    </SitePageShell>
  );
}
