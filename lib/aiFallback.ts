import { getAgencyDemoPlan } from "@/demoData/agencyDemo";

export function getFallbackDemoPlan() {
  return getAgencyDemoPlan("climate-change");
}

export const aiFallbackMessage = "AI 服务暂时不可用，已使用 Demo 内容继续演示。";
