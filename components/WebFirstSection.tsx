import { Globe2, MonitorPlay, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const webValues = [
  {
    icon: Globe2,
    title: "打开网址即可演示",
    text: "代理商不需要下载安装，Chrome、Edge、Safari 和 iPad 浏览器都能进入 Demo。"
  },
  {
    icon: MonitorPlay,
    title: "30 秒进入课堂",
    text: "登录 demo 账号后直接进入 Demo Classroom，一键开始全屏课堂演示。"
  },
  {
    icon: ShieldCheck,
    title: "AI 异常也不崩",
    text: "DeepSeek 不可用时自动切换固定 Demo 内容，课堂演示流程继续可用。"
  },
  {
    icon: Smartphone,
    title: "PWA 预留",
    text: "未来可添加到桌面，获得接近 App 的入口体验，同时保留 Web 的稳定交付。"
  }
];

export function WebFirstSection() {
  return (
    <section id="web-first" className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <div className="rounded-lg border border-cyan-900/10 bg-white/92 p-5 shadow-glow backdrop-blur">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Web First Architecture
            </p>
            <h2 className="mt-1 text-3xl font-semibold text-slate-950">
              智课主版本：打开网址就能演示
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              智课的核心价值是 AI 教学演示体验。Web 作为主产品路线，Desktop 只保留为离线 Demo 备用包。
            </p>
          </div>
          <Button asChild className="bg-slate-950 text-white hover:bg-slate-800">
            <a href="#agency-demo-mode">
              <MonitorPlay className="h-4 w-4" />
              进入 Web Demo
            </a>
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {webValues.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-lg bg-slate-50 p-4">
                <Icon className="h-5 w-5 text-cyan-600" />
                <h3 className="mt-3 font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
