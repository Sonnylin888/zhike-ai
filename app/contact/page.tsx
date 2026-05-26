import { Handshake, Mail } from "lucide-react";
import { SitePageShell } from "@/components/SitePageShell";

export default function ContactPage() {
  return (
    <SitePageShell
      eyebrow="Cooperation"
      title="联系合作"
      description="适合学校试讲、代理商合作、教育装备方案演示和 AI 课堂试点沟通。"
    >
      <div className="rounded-lg bg-white p-5 shadow-glow">
        <Handshake className="h-5 w-5 text-cyan-600" />
        <h2 className="mt-4 text-xl font-semibold text-slate-950">建议合作路径</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          先完成 1 次 Web Demo 试讲，再选择 2-3 节学科课例共创，最后形成学校 AI 课堂展示材料。
        </p>
        <p className="mt-4 flex items-center gap-2 rounded-md bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-900">
          <Mail className="h-4 w-4" />
          请使用项目负责人提供的合作联系方式。
        </p>
      </div>
    </SitePageShell>
  );
}
