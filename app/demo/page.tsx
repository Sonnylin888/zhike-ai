import { InputForm } from "@/components/InputForm";
import { SitePageShell } from "@/components/SitePageShell";

export default function DemoClassroomPage() {
  return (
    <SitePageShell
      eyebrow="Demo Classroom"
      title="代理商 Web Demo"
      description="打开网址、登录 Demo 账号、进入 Demo Classroom，一键开始 AI 课堂演示。"
    >
      <InputForm />
    </SitePageShell>
  );
}
