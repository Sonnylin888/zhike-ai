import { Download, MonitorPlay, School } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CooperationCTA() {
  return (
    <section className="rounded-lg bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Next Step
          </p>
          <h2 className="mt-2 text-3xl font-semibold">下一步合作建议</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            先从 1 次学校试讲和 2-3 节学科案例开始，让老师参与反馈，再逐步形成学校自己的 AI 课堂展示材料。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
            <a href="#school-trial-mode">
              <School className="h-4 w-4" />
              开始学校试讲
            </a>
          </Button>
          <Button asChild variant="secondary" className="border-white/15 bg-white/10 text-white hover:bg-white/16">
            <a href="#classroom-workbench">
              <MonitorPlay className="h-4 w-4" />
              查看课堂 Demo
            </a>
          </Button>
          <Button asChild variant="secondary" className="border-white/15 bg-white/10 text-white hover:bg-white/16">
            <a href="#trial-feedback">
              <Download className="h-4 w-4" />
              导出试讲反馈
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
