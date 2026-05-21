import type { TeacherInput, TextbookContent } from "@/lib/textbook";

export type TeachingPlan = {
  lessonPlan: string[];
  pptOutline: string[];
  interactionQuestions: string[];
  homework: string[];
  slides: Slide[];
};

export type Slide = {
  title: string;
  content: string[];
  teacherNote: string;
  question: string;
  imagePrompt: string;
  duration: string;
  teacherTip: string;
  quiz: {
    type: "single" | "trueFalse" | "raiseHand";
    question: string;
    options: string[];
    answer: string;
  };
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
6. 将 PPT 大纲拆成 4-6 个 slides，每页都要包含 title、content、teacherNote、question、imagePrompt、duration、teacherTip、quiz。
7. imagePrompt 使用适合课堂投影的高清教育科技风关键词，不要写绘画风。
8. quiz 用于课堂互动，type 只能是 single、trueFalse、raiseHand；选择题给 3 个 options，判断题给“正确/错误”，举手互动给 2-3 个可举手选项。
9. 严格输出 JSON，不要 Markdown，不要代码块，不要额外解释。

JSON 格式如下：
{
  "lessonPlan": ["教案结构要点 1", "教案结构要点 2", "教案结构要点 3", "教案结构要点 4"],
  "pptOutline": ["PPT 大纲 1", "PPT 大纲 2", "PPT 大纲 3", "PPT 大纲 4"],
  "slides": [
    {
      "title": "气候变化是什么？",
      "content": ["全球气温变化趋势", "温室气体增加", "人类活动影响"],
      "teacherNote": "引导学生观察近百年气温变化曲线。",
      "question": "你认为气候变化和我们的生活有什么关系？",
      "imagePrompt": "全球变暖、地球、温室效应、气候变化、高清课堂投影、科技感",
      "duration": "5分钟",
      "teacherTip": "建议此处进入课堂讨论，让学生先说现象再归纳概念。",
      "quiz": {
        "type": "single",
        "question": "下列哪项最能作为全球变暖的证据？",
        "options": ["长期气温上升趋势", "某一天突然降温", "一次局地降雨"],
        "answer": "长期气温上升趋势"
      }
    }
  ],
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
  slides: [
    {
      title: "气候为什么正在变化？",
      content: ["从生活中的高温、暴雨等现象导入", "提出本课核心问题", "建立“证据-原因-影响-应对”学习路径"],
      teacherNote: "用近年极端天气新闻或校园高温体验开场，让学生先说出自己的观察。",
      question: "你最近感受到的天气变化，可能和气候变化有关吗？",
      imagePrompt: "气候变化、地球、课堂投影、天气数据、科技蓝",
      duration: "4分钟",
      teacherTip: "先让学生举例，再把生活经验收束到本课核心问题。",
      quiz: {
        type: "raiseHand",
        question: "你认为身边最明显的气候变化感受是什么？",
        options: ["高温更频繁", "暴雨更集中", "季节节奏变化"],
        answer: "开放讨论"
      }
    },
    {
      title: "证据解读：气温与二氧化碳",
      content: ["全球平均气温呈波动上升趋势", "二氧化碳浓度持续增加", "冰川退缩和海平面上升提供旁证"],
      teacherNote: "引导学生先读坐标轴，再描述趋势，最后尝试解释变量之间的联系。",
      question: "气温曲线和二氧化碳浓度曲线有哪些相似之处？",
      imagePrompt: "全球气温曲线、二氧化碳浓度、冰川融化、数据可视化",
      duration: "6分钟",
      teacherTip: "建议切换到读图节奏，追问“先描述，再解释”。",
      quiz: {
        type: "single",
        question: "读图时最先应该确认什么？",
        options: ["坐标轴与单位", "图片颜色", "标题字体"],
        answer: "坐标轴与单位"
      }
    },
    {
      title: "原因分析：温室效应增强",
      content: ["太阳辐射进入地表系统", "温室气体吸收地面长波辐射", "工业生产、交通和能源消费加剧排放"],
      teacherNote: "用能量收支示意图讲清机制，避免只停留在“变热了”的结论。",
      question: "为什么温室气体增加会让地表平均气温升高？",
      imagePrompt: "温室效应、太阳辐射、地球能量收支、人类活动排放",
      duration: "7分钟",
      teacherTip: "此页适合板书“短波进入、长波受阻”的机制链条。",
      quiz: {
        type: "trueFalse",
        question: "温室效应完全由人类活动造成。",
        options: ["正确", "错误"],
        answer: "错误"
      }
    },
    {
      title: "影响与应对：走向低碳生活",
      content: ["影响农业、水资源、生态系统和城市安全", "不同区域的风险并不相同", "减缓排放与主动适应需要同时推进"],
      teacherNote: "联系中国双碳目标和校园行动，让学生把宏观议题落到可执行选择。",
      question: "如果为学校设计一项低碳行动，你会优先做什么？",
      imagePrompt: "低碳城市、绿色校园、可再生能源、城市热岛效应",
      duration: "5分钟",
      teacherTip: "建议收束为小组快答，用一个校园行动对应一个地理依据。",
      quiz: {
        type: "raiseHand",
        question: "你更支持哪类校园低碳行动？",
        options: ["节能照明", "绿色出行", "垃圾分类与回收"],
        answer: "开放讨论"
      }
    }
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
