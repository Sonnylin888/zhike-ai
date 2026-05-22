export type TeachingStyle =
  | "启发式"
  | "应试型"
  | "互动型"
  | "公开课型"
  | "案例型"
  | "探究型"
  | "图像分析型"
  | "推导型"
  | "练习型"
  | "故事型"
  | "讨论型"
  | "线索型"
  | "口语型"
  | "考试型";

export type LessonTemplate = {
  id: string;
  subject: string;
  grade: string;
  version: string;
  topic: string;
  recommendedStyle: TeachingStyle;
  description: string;
};

export const lessonTemplates: LessonTemplate[] = [
  {
    id: "geo-climate",
    subject: "地理",
    grade: "高中",
    version: "人教版",
    topic: "气候变化",
    recommendedStyle: "探究型",
    description: "适合展示地图、案例和现实问题讨论"
  },
  {
    id: "history-opium-war",
    subject: "历史",
    grade: "初中",
    version: "人教版",
    topic: "鸦片战争",
    recommendedStyle: "线索型",
    description: "适合时间线、历史背景和事件因果分析"
  },
  {
    id: "math-fraction",
    subject: "数学",
    grade: "小学",
    version: "人教版",
    topic: "分数加减法",
    recommendedStyle: "练习型",
    description: "适合公式推导、例题讲解和步骤板书"
  },
  {
    id: "english-past-tense",
    subject: "英语",
    grade: "初中",
    version: "人教版",
    topic: "一般过去时",
    recommendedStyle: "口语型",
    description: "适合单词、句型、跟读和对话练习"
  }
];

export const subjectStyleOptions: Record<string, TeachingStyle[]> = {
  地理: ["案例型", "探究型", "图像分析型", "启发式"],
  数学: ["推导型", "练习型", "应试型", "互动型"],
  历史: ["故事型", "讨论型", "线索型", "公开课型"],
  英语: ["口语型", "互动型", "考试型", "公开课型"]
};

export function getSubjectStyleOptions(subject: string) {
  return subjectStyleOptions[subject] || ["启发式", "应试型", "互动型", "公开课型"];
}
