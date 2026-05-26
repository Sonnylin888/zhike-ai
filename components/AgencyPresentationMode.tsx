import { MonitorPlay, Route } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AgencyPresentationMode() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <div className="rounded-lg bg-slate-950 p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              <Route className="h-4 w-4" />
              Agency Presentation Mode
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Web 固定演示路线</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              默认气候变化课堂，代理商打开网址登录后点击开始演示，大字体、全屏播放、投影友好。
            </p>
          </div>
          <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
            <a href="#agency-demo-mode">
              <MonitorPlay className="h-4 w-4" />
              进入 Demo Classroom
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
