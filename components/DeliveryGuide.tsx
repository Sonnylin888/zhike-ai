import { BookOpenCheck, FolderOpen, HelpCircle } from "lucide-react";

const guideItems = [
  {
    title: "如何打开智课",
    text: "优先打开智课 Web 网址，Chrome、Edge、Safari 和 iPad 浏览器都可以演示。"
  },
  {
    title: "Demo 账号",
    text: "使用项目负责人分配的 demo01 至 demo06 账号登录，默认密码为 123456。"
  },
  {
    title: "课堂演示",
    text: "登录后选择 Demo Classroom，点击“开始 AI 课堂演示”进入全屏课堂。"
  },
  {
    title: "AI 生成",
    text: "联网时可每日体验 20 次 AI 教学生成；查看 Demo 和全屏播放不扣次数。"
  },
  {
    title: "断网演示",
    text: "Web 版会自动切换固定 Demo 内容；Desktop 包仅作为无网络学校场景备用。"
  },
  {
    title: "常见问题",
    text: "如果页面异常，返回 Demo Classroom 或刷新浏览器；本地 Desktop 备用包才会写入 logs。"
  }
];

export function DeliveryGuide() {
  return (
    <section
      id="delivery-guide"
      className="mx-auto max-w-6xl scroll-mt-8 px-4 py-10 md:px-8"
    >
      <div className="rounded-lg border border-cyan-900/10 bg-white/92 p-5 shadow-glow backdrop-blur">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Delivery Guide
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">代理商交付说明</h2>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-cyan-50">
            <FolderOpen className="h-4 w-4 text-cyan-200" />
            Web First · Desktop Backup
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {guideItems.map((item) => (
            <article key={item.title} className="rounded-lg bg-slate-50 p-4">
              <BookOpenCheck className="h-5 w-5 text-cyan-600" />
              <h3 className="mt-3 font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-md bg-cyan-50 px-3 py-3 text-sm leading-6 text-cyan-900">
          <HelpCircle className="mt-0.5 h-4 w-4 shrink-0" />
          联系支持：请将 logs 目录和截图一起发给项目负责人，便于远程排查。
        </div>
      </div>
    </section>
  );
}
