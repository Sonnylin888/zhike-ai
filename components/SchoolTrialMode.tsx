import { MonitorPlay, Route, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SchoolValueCards } from "@/components/SchoolValueCards";
import { TrialSteps } from "@/components/TrialSteps";

export function SchoolTrialMode() {
  return (
    <section
      id="school-trial-mode"
      className="mx-auto flex max-w-6xl scroll-mt-8 flex-col gap-5 px-4 py-8 md:px-8"
    >
      <div className="overflow-hidden rounded-lg border border-cyan-900/10 bg-white/92 p-5 shadow-glow backdrop-blur">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-md bg-cyan-50 px-3 py-1.5 text-sm font-semibold text-cyan-800">
              <Sparkles className="h-4 w-4" />
              School Trial Mode
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-slate-950 md:text-4xl">
              学校试讲模式
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              面向学校现场 Demo 的完整路径：选案例、生成课堂包、进入课堂演示、展示教师中控台，再收集试讲反馈。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild className="bg-slate-950 text-white hover:bg-slate-800">
                <a href="#classroom-workbench">
                  <MonitorPlay className="h-4 w-4" />
                  一键进入试讲
                </a>
              </Button>
              <Button asChild variant="secondary">
                <a href="#trial-summary">
                  <Route className="h-4 w-4" />
                  查看试讲收尾
                </a>
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-slate-950 p-5 text-white">
            <p className="text-sm font-semibold text-cyan-200">现场演示重点</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-cyan-50/78">
              <p className="rounded-md bg-white/8 px-3 py-2">不依赖登录、数据库或后台配置。</p>
              <p className="rounded-md bg-white/8 px-3 py-2">AI 不替代教师，只减少备课和组织课堂的重复劳动。</p>
              <p className="rounded-md bg-white/8 px-3 py-2">API 不可用时自动保持本地 Demo 流程可演示。</p>
            </div>
          </div>
        </div>
      </div>
      <TrialSteps />
      <SchoolValueCards />
    </section>
  );
}
