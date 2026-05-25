import type { TeachingPlan } from "@/lib/prompt";

export type DemoHealthInput = {
  plan: TeachingPlan | null;
  source: string;
  activeTemplateLabel?: string;
  fullscreenSupported: boolean;
};

export type DemoHealthItem = {
  label: string;
  value: string;
  status: "ready" | "fallback" | "warning";
};

export function getDemoHealth({
  plan,
  source,
  activeTemplateLabel,
  fullscreenSupported
}: DemoHealthInput): DemoHealthItem[] {
  const usesFallback =
    source === "demo-fallback" ||
    source === "ai-fallback" ||
    source === "fixed-demo" ||
    !source;
  const dataComplete = Boolean(
    plan?.slides?.length &&
      plan.lessonWorkflow &&
      plan.afterClassSummary &&
      plan.homeworkPlan &&
      plan.teachingReflection
  );

  return [
    {
      label: "AI API 状态",
      value: usesFallback ? "本地 Demo 数据" : "AI 生成可用",
      status: usesFallback ? "fallback" : "ready"
    },
    {
      label: "Mock fallback",
      value: "已启用",
      status: "ready"
    },
    {
      label: "当前案例",
      value: activeTemplateLabel || "等待选择",
      status: activeTemplateLabel ? "ready" : "warning"
    },
    {
      label: "全屏模式",
      value: fullscreenSupported ? "可用" : "浏览器不支持",
      status: fullscreenSupported ? "ready" : "warning"
    },
    {
      label: "课堂包完整度",
      value: dataComplete ? "完整" : "生成后检查",
      status: dataComplete ? "ready" : "warning"
    }
  ];
}
