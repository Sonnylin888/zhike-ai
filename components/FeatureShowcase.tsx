import {
  BookOpenCheck,
  ClipboardCheck,
  Image,
  MessageSquare,
  MonitorPlay,
  PenLine,
  Presentation,
  RotateCcw
} from "lucide-react";

const features = [
  { icon: BookOpenCheck, title: "AI 教案", text: "生成目标、重点、流程与课堂准备。" },
  { icon: Presentation, title: "AI PPT", text: "自动拆成可演示的 Slide 页面。" },
  { icon: Image, title: "AI 配图", text: "按主题匹配课堂投影视觉。" },
  { icon: MessageSquare, title: "AI 课堂互动", text: "提问、小测、讨论节点自动组织。" },
  { icon: MonitorPlay, title: "AI 讲稿", text: "每页给老师自然讲法和过渡语。" },
  { icon: PenLine, title: "AI 板书", text: "生成黑板式关键词和结构提示。" },
  { icon: ClipboardCheck, title: "AI 作业", text: "基础、提高、拓展任务分层输出。" },
  { icon: RotateCcw, title: "AI 复盘", text: "提示课堂风险、易错点和补讲建议。" }
];

export function FeatureShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
          AI Capabilities
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">
          一套课堂，从备课到复盘
        </h2>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="rounded-lg border border-cyan-900/10 bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.07)]">
              <Icon className="h-5 w-5 text-cyan-600" />
              <p className="mt-4 font-semibold text-slate-950">{feature.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
