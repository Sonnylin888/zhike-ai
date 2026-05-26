import { ArrowDown, Handshake, MonitorPlay, School, Sparkles } from "lucide-react";
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
              <p className="text-base font-semibold">智课 v1.4</p>
              <p className="text-xs text-cyan-100/70">Web AI Classroom</p>
            </div>
          </div>
          <div className="hidden rounded-md border border-white/14 bg-white/10 px-3 py-1.5 text-xs font-semibold text-cyan-50 backdrop-blur sm:block">
            Web First Demo
          </div>
        </header>

        <div className="max-w-4xl py-14">
          <p className="mb-5 inline-flex items-center gap-2 rounded-md border border-cyan-200/20 bg-cyan-200/10 px-3 py-1.5 text-sm font-semibold text-cyan-100">
            <Sparkles className="h-4 w-4" />
            Web First，打开网址即可演示
          </p>
          <h1 className="text-5xl font-semibold leading-[1.04] tracking-normal md:text-7xl">
            AI 未来课堂
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-100/86">
            代理商打开网址即可登录 Demo Classroom，一键进入全屏 AI 课堂演示；AI 服务异常时自动切换 Demo 模式。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-cyan-300 text-slate-950 shadow-[0_18px_42px_rgba(34,211,238,0.32)] hover:bg-cyan-200"
            >
              <a href="#classroom-workbench">
                <MonitorPlay className="h-4 w-4" />
                进入 Demo Classroom
              </a>
            </Button>
            <Button asChild variant="secondary" className="border-white/15 bg-white/10 text-white hover:bg-white/16">
              <a href="#demo-gallery">
                <ArrowDown className="h-4 w-4" />
                查看 Demo
              </a>
            </Button>
            <Button asChild variant="secondary" className="border-white/15 bg-white/10 text-white hover:bg-white/16">
              <a href="#school-trial-mode">
                <School className="h-4 w-4" />
                学校试讲模式
              </a>
            </Button>
            <Button asChild variant="secondary" className="border-white/15 bg-white/10 text-white hover:bg-white/16">
              <a href="#cooperation">
                <Handshake className="h-4 w-4" />
                合作方案
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 pb-4 md:grid-cols-3">
          {["打开网址即演示", "大屏全屏课堂", "AI 异常自动兜底"].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/8 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-cyan-100">{item}</p>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                面向代理商推广的 Web 演示体验，不依赖安装，不让 AI 异常打断展示。
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
