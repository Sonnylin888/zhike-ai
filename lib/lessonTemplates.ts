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
  caseProfile: {
    whyGoodForDemo: string;
    classroomValue: string;
    aiHighlights: string[];
    expectedAudience: string;
  };
};

export const lessonTemplates: LessonTemplate[] = [
  {
    id: "geo-climate",
    subject: "地理",
    grade: "高中",
    version: "人教版",
    topic: "气候变化",
    recommendedStyle: "探究型",
    description: "适合展示地图、案例和现实问题讨论",
    caseProfile: {
      whyGoodForDemo: "主题贴近现实，适合展示图片、问题链和跨区域案例分析。",
      classroomValue: "帮助老师把抽象环境议题转成可观察、可讨论的课堂活动。",
      aiHighlights: ["AI 配图与读图提示", "课堂讨论问题链", "低碳行动课后任务"],
      expectedAudience: "适合给地理老师、教研主任和校长展示"
    }
  },
  {
    id: "history-opium-war",
    subject: "历史",
    grade: "初中",
    version: "人教版",
    topic: "鸦片战争",
    recommendedStyle: "线索型",
    description: "适合时间线、历史背景和事件因果分析",
    caseProfile: {
      whyGoodForDemo: "历史线索清晰，便于展示 AI 如何组织背景、人物与因果。",
      classroomValue: "让历史课从事件罗列转向证据分析和观点讨论。",
      aiHighlights: ["时间线课堂卡片", "因果链讲稿", "历史观点讨论提示"],
      expectedAudience: "适合给文科老师、历史教研组和学校管理者展示"
    }
  },
  {
    id: "math-fraction",
    subject: "数学",
    grade: "小学",
    version: "人教版",
    topic: "分数加减法",
    recommendedStyle: "练习型",
    description: "适合公式推导、例题讲解和步骤板书",
    caseProfile: {
      whyGoodForDemo: "知识点具体，能直观看到推导、例题和板书步骤的生成效果。",
      classroomValue: "辅助老师把解题过程讲清楚，减少重复备题和板书设计时间。",
      aiHighlights: ["公式与步骤卡片", "例题讲解提示", "易错点复盘建议"],
      expectedAudience: "适合给数学老师、小学教研主任和校长展示"
    }
  },
  {
    id: "english-past-tense",
    subject: "英语",
    grade: "初中",
    version: "人教版",
    topic: "一般过去时",
    recommendedStyle: "口语型",
    description: "适合单词、句型、跟读和对话练习",
    caseProfile: {
      whyGoodForDemo: "课堂活动感强，便于展示跟读、对话和即时互动。",
      classroomValue: "帮助英语老师快速准备句型操练、口语任务和小测验。",
      aiHighlights: ["核心句型卡片", "对话练习设计", "口语互动提示"],
      expectedAudience: "适合给英语老师、信息化主任和校长展示"
    }
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
