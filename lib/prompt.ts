import type { TeacherInput, TextbookContent } from "@/lib/textbook";

export type TeachingPlan = {
  lessonPlan: string[];
  pptOutline: string[];
  interactionQuestions: string[];
  homework: string[];
};

export function buildTeachingPrompt(
  input: TeacherInput,
  textbook: TextbookContent
) {
  return `
你是一名有 15 年一线经验的高中地理教师，熟悉人教版高中地理教材与公开课展示。

请根据“老师输入”和“教材内容”，生成一份可以直接用于课堂准备的教学方案。

老师输入：
- 学段/年级：${input.grade}
- 学科：${input.subject}
- 课题：${input.topic}
- 教材版本：${input.textbookVersion}

教材内容：
- 章节：${textbook.chapter}
- 教材摘要：${textbook.textbookSummary}
- 核心概念：${textbook.coreConcepts.join("；")}
- 学习目标：${textbook.learningObjectives.join("；")}
- 建议素材：${textbook.suggestedMaterials.join("；")}
- 教学重点：${textbook.teachingFocus}
- 教学难点：${textbook.teachingDifficulty}

生成要求：
1. 使用中文。
2. 专业但简洁，老师可以直接使用。
3. 不要空话，不要泛泛而谈。
4. 适合高中地理课堂，突出地理综合思维、人地协调观和案例分析。
5. 内容不要过长，控制在 30 秒内可返回。
6. 严格输出 JSON，不要 Markdown，不要代码块，不要额外解释。

JSON 格式如下：
{
  "lessonPlan": ["教案结构要点 1", "教案结构要点 2", "教案结构要点 3", "教案结构要点 4"],
  "pptOutline": ["PPT 大纲 1", "PPT 大纲 2", "PPT 大纲 3", "PPT 大纲 4"],
  "interactionQuestions": ["课堂互动问题 1", "课堂互动问题 2", "课堂互动问题 3"],
  "homework": ["课后练习 1", "课后练习 2", "课后练习 3"]
}
`.trim();
}

export const demoTeachingPlan: TeachingPlan = {
  lessonPlan: [
    "导入：展示近百年全球平均气温变化曲线，引导学生判断气候变化的主要趋势。",
    "新授：区分气候变化与全球变暖，结合温室气体资料分析人为活动对地表能量收支的影响。",
    "探究：以冰川退缩、海平面上升和极端天气为案例，分析气候变化对自然环境与人类活动的影响。",
    "总结：归纳“表现-成因-影响-应对”的分析框架，联系双碳目标理解人地协调。"
  ],
  pptOutline: [
    "第 1 页：课题与核心问题：气候为什么正在变化？",
    "第 2 页：证据解读：气温曲线、二氧化碳浓度与典型环境变化。",
    "第 3 页：原因分析：自然因素与人类活动，重点解释温室效应增强。",
    "第 4 页：影响与应对：区域差异、减缓措施、适应措施和中国行动。"
  ],
  interactionQuestions: [
    "从全球气温变化曲线中，你能读出哪些趋势和异常年份？",
    "为什么气候变化对低海拔沿海地区、干旱地区和高山冰川区影响不同？",
    "如果你是城市规划者，可以采取哪些措施适应更频繁的高温和暴雨？"
  ],
  homework: [
    "用 150 字说明全球变暖与温室气体增加之间的关系。",
    "任选一个地区，分析气候变化可能带来的两项影响。",
    "设计一条校园低碳行动建议，并说明其地理依据。"
  ]
};
