import { ArrowDown, MonitorPlay, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[82vh] overflow-hidden rounded-b-[28px] bg-slate-950 text-white">
      <img
        src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=80"
        alt="AI future classroom"
        className="absolute inset-0 h-full w-full object-cover opacity-42"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/70 to-slate-950" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:46px_46px]" />

      <div className="relative mx-auto flex min-h-[82vh] max-w-6xl flex-col justify-between px-4 py-6 md:px-8 md:py-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-cyan-300 text-sm font-black text-slate-950">
              ZK
            </div>
            <div>
              <p className="text-base font-semibold">zhike-ai v1.0</p>
              <p className="text-xs text-cyan-100/70">AI Teaching Console</p>
            </div>
          </div>
          <div className="hidden rounded-md border border-white/14 bg-white/10 px-3 py-1.5 text-xs font-semibold text-cyan-50 backdrop-blur sm:block">
            Future Classroom Demo
          </div>
        </header>

        <div className="max-w-4xl py-14">
          <p className="mb-5 inline-flex items-center gap-2 rounded-md border border-cyan-200/20 bg-cyan-200/10 px-3 py-1.5 text-sm font-semibold text-cyan-100">
            <Sparkles className="h-4 w-4" />
            教师主导，AI 辅助课堂工作流
          </p>
          <h1 className="text-5xl font-semibold leading-[1.04] tracking-normal md:text-7xl">
            AI 未来课堂
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-100/86">
            30 秒生成一整节 AI 课堂，从课前备课、课堂演示到课后复盘，让老师把时间留给真正的教学判断。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-cyan-300 text-slate-950 shadow-[0_18px_42px_rgba(34,211,238,0.32)] hover:bg-cyan-200"
            >
              <a href="#classroom-workbench">
                <MonitorPlay className="h-4 w-4" />
                开始生成课堂
              </a>
            </Button>
            <Button asChild variant="secondary" className="border-white/15 bg-white/10 text-white hover:bg-white/16">
              <a href="#demo-gallery">
                <ArrowDown className="h-4 w-4" />
                查看 Demo
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 pb-4 md:grid-cols-3">
          {["AI 教师工作台", "沉浸式课堂播放", "课后总结与复盘"].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/8 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-cyan-100">{item}</p>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                面向学校 Demo 的稳定课堂体验，不替代教师，只减少重复工作。
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
