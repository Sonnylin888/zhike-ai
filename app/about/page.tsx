import { Globe2, ShieldCheck } from "lucide-react";
import { SitePageShell } from "@/components/SitePageShell";

export default function AboutPage() {
  return (
    <SitePageShell
      eyebrow="About Zhike"
      title="关于智课"
      description="智课是 Web First 的 AI 教学课堂演示系统，面向代理商推广、学校试讲和未来课堂展示。"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg bg-white p-5 shadow-glow">
          <Globe2 className="h-5 w-5 text-cyan-600" />
          <h2 className="mt-4 text-xl font-semibold text-slate-950">为什么 Web 优先</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            打开网址即可演示，降低代理商第一次体验门槛，也避免本地安装、系统兼容和路径问题。
          </p>
        </article>
        <article className="rounded-lg bg-white p-5 shadow-glow">
          <ShieldCheck className="h-5 w-5 text-cyan-600" />
          <h2 className="mt-4 text-xl font-semibold text-slate-950">教师主导</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            智课提供教案、PPT、互动和复盘建议，最终由老师判断、调整和组织课堂。
          </p>
        </article>
      </div>
    </SitePageShell>
  );
}
