import { getDemoTeachingPlan } from "@/lib/prompt";
import type { TeachingStyle } from "@/lib/lessonTemplates";

export type AgencyDemoCase = {
  id: string;
  title: string;
  topic: string;
  description: string;
  teachingStyle: TeachingStyle;
  highlight: string;
};

export const agencyDemoCases: AgencyDemoCase[] = [
  {
    id: "climate-change",
    title: "气候变化",
    topic: "气候变化",
    description: "展示真实议题、AI 配图、课堂讨论和课后复盘。",
    teachingStyle: "探究型",
    highlight: "适合 30 秒内展示未来课堂完整价值"
  },
  {
    id: "ocean-current",
    title: "洋流",
    topic: "洋流",
    description: "适合展示地图观察、成因分析和区域影响。",
    teachingStyle: "图像分析型",
    highlight: "突出地理读图和案例推理"
  },
  {
    id: "china-terrain",
    title: "中国地形",
    topic: "中国地形",
    description: "适合展示地形阶梯、区域差异和板书结构。",
    teachingStyle: "案例型",
    highlight: "适合学校领导快速理解多学科 Demo 可复制"
  },
  {
    id: "earthquake",
    title: "地震",
    topic: "地震",
    description: "适合展示情境导入、安全教育和课堂互动。",
    teachingStyle: "互动型",
    highlight: "课堂参与感强，适合代理商现场演示"
  }
];

export function getAgencyDemoPlan(demoCaseId = agencyDemoCases[0].id) {
  const demoCase =
    agencyDemoCases.find((item) => item.id === demoCaseId) || agencyDemoCases[0];

  return getDemoTeachingPlan({
    grade: "高中",
    subject: "地理",
    topic: demoCase.topic,
    textbookVersion: "人教版",
    teachingStyle: demoCase.teachingStyle
  });
}
