import type { TeacherInput, TextbookContent } from "@/lib/textbook";
import { getSubjectPromptStrategy } from "@/lib/subjectPrompts";

export type TeachingPlan = {
  lessonPlan: string[];
  pptOutline: string[];
  interactionQuestions: string[];
  homework: string[];
  lessonWorkflow?: LessonWorkflow;
  afterClassSummary?: AfterClassSummary;
  homeworkPlan?: HomeworkPlan;
  teachingReflection?: TeachingReflection;
  lessonSummary?: {
    totalDuration: string;
    totalSlides: number;
    totalQuestions: number;
    totalInteractions: number;
    teachingStyle: string;
  };
  slides: Slide[];
};

export type LessonWorkflow = {
  beforeClass: {
    lessonGoal: string;
    keyPoints: string[];
    materials: string[];
    teacherPreparation: string[];
  };
  inClass: {
    teachingFlow: string[];
    interactionMoments: string[];
    pacePlan: string;
  };
  afterClass: {
    summary: string;
    homework: string[];
    reflection: string;
  };
};

export type AfterClassSummary = {
  classSummary: string;
  studentTakeaways: string[];
  teacherReflection: string;
  nextLessonSuggestion: string;
};

export type HomeworkPlan = {
  basicHomework: string[];
  advancedHomework: string[];
  optionalTask: string;
  estimatedTime: string;
};

export type TeachingReflection = {
  possibleProblems: string[];
  adjustmentSuggestions: string[];
  studentMisconceptions: string[];
  reteachSuggestion: string;
};

export type SpeakerScript = {
  opening: string;
  explanation: string;
  transition: string;
  boardWriting: string[];
  commonMistakes: string[];
};

export type PaceControl = {
  duration: string;
  explainTime: string;
  questionTime: string;
  interactionType: string;
  paceWarning: string;
};

export type QuestionGuide = {
  warmUpQuestion: string;
  deepQuestion: string;
  followUpQuestion: string;
  expectedAnswer: string;
};

export type GeoModule = {
  mapFocus: string;
  caseStudy: string;
  realWorldConnection: string;
};

export type MathModule = {
  formula: string;
  steps: string[];
  exampleProblem: string;
  solutionHint: string;
};

export type HistoryModule = {
  timeline: string[];
  keyFigures: string[];
  causeEffect: string;
};

export type EnglishModule = {
  vocabulary: string[];
  sentencePattern: string;
  speakingTask: string;
  dialogue: string[];
};

export type Slide = {
  title: string;
  content: string[];
  teacherNote: string;
  question: string;
  imagePrompt: string;
  duration: string;
  interactionCount: number;
  paceTip: string;
  teacherTip: string;
  discussionPrompt: string;
  boardWriting: string[];
  speakerScript: SpeakerScript;
  paceControl: PaceControl;
  questionGuide: QuestionGuide;
  geoModule?: GeoModule;
  mathModule?: MathModule;
  historyModule?: HistoryModule;
  englishModule?: EnglishModule;
  speakerAssistant: {
    talkScript: string;
    keyPoints: string[];
    studentQuestions: string[];
    teacherAnswers: string[];
  };
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
  const teachingStyle = input.teachingStyle || "启发式";
  const styleInstruction: Record<string, string> = {
    启发式: "更多问题链、追问和观察-归纳路径，少直接给结论。",
    应试型: "突出考点、易错点、规范表达和随堂练习，帮助学生迁移到试题。",
    互动型: "增加讨论、小测验、举手互动和学生表达机会，课堂节奏更开放。",
    公开课型: "强化导入、板书感、课堂节奏、展示语言和可观摩的活动设计。",
    案例型: "用案例驱动概念理解，强调真实区域和现实问题。",
    探究型: "通过问题链、材料观察和学生推理推进课堂。",
    图像分析型: "强调读图、析图、地图证据和空间表达。",
    推导型: "突出概念到公式的推导过程和板书步骤。",
    练习型: "用例题、变式和即时练习巩固方法。",
    故事型: "用历史情境和人物故事带出事件逻辑。",
    讨论型: "用观点辨析和材料讨论推动历史解释。",
    线索型: "围绕时间线、因果线和影响线组织课堂。",
    口语型: "强调跟读、替换操练、对话表达和真实交流。",
    考试型: "强调语法规则、易错点和题型迁移。"
  };
  const subjectStrategy = getSubjectPromptStrategy(input.subject);

  return `
你是一名有 15 年一线经验的高中地理教师，熟悉人教版高中地理教材与公开课展示。

请根据“老师输入”和“教材内容”，生成一份可以直接用于课堂准备的教学方案。

老师输入：
- 学段/年级：${input.grade}
- 学科：${input.subject}
- 课题：${input.topic}
- 教材版本：${input.textbookVersion}
- 教学风格：${teachingStyle}（${styleInstruction[teachingStyle] || "根据学科特点组织课堂活动。"}）
- 学科生成策略：${subjectStrategy}

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
6. 将 PPT 大纲拆成 4-6 个 slides，每页都要包含 title、content、teacherNote、question、imagePrompt、duration、interactionCount、paceTip、teacherTip、discussionPrompt、boardWriting、speakerScript、paceControl、questionGuide、speakerAssistant、quiz。
7. imagePrompt 使用适合课堂投影的高清教育科技风关键词，不要写绘画风。
8. quiz 用于课堂互动，type 只能是 single、trueFalse、raiseHand；选择题给 3 个 options，判断题给“正确/错误”，举手互动给 2-3 个可举手选项。
9. speakerScript 是老师可直接照着讲的课堂话术，不要像论文；opening、explanation、transition 每段控制在 60 字内。
10. boardWriting 是板书建议，2-4 条，像真实黑板标题。
11. paceControl 要包含讲解时间、互动时间、互动类型和节奏提醒。
12. questionGuide 要有导入问题、深度问题、追问和参考回答，问题要有层次。
13. speakerAssistant 要简洁，给老师快速扫读：talkScript 控制在 80 字内，keyPoints 2-3 条，studentQuestions 1-2 条，teacherAnswers 与问题一一对应。
14. Slide 内容、互动问题、讲解提示都要体现“${teachingStyle}”风格。
15. 根据学科只输出对应模块：地理输出 geoModule；数学输出 mathModule；历史输出 historyModule；英语输出 englishModule。不要四个模块一起输出。
16. 生成完整课堂包，顶层必须包含 lessonWorkflow、afterClassSummary、homeworkPlan、teachingReflection。
17. lessonWorkflow 覆盖课前准备、课中教学、课后总结；内容要简洁实用。
18. homeworkPlan 区分基础作业、提高作业和拓展任务，数量不要多。
19. teachingReflection 只做教师复盘建议，不要假装有真实学生数据。
20. 严格输出 JSON，不要 Markdown，不要代码块，不要额外解释。

JSON 格式如下：
{
  "lessonPlan": ["教案结构要点 1", "教案结构要点 2", "教案结构要点 3", "教案结构要点 4"],
  "pptOutline": ["PPT 大纲 1", "PPT 大纲 2", "PPT 大纲 3", "PPT 大纲 4"],
  "lessonWorkflow": {
    "beforeClass": {
      "lessonGoal": "理解气候变化的表现、证据和影响。",
      "keyPoints": ["气候变化证据", "温室效应增强", "低碳应对"],
      "materials": ["气温变化曲线", "二氧化碳浓度资料", "案例图片"],
      "teacherPreparation": ["准备导入问题", "确认读图材料", "预设学生易错点"]
    },
    "inClass": {
      "teachingFlow": ["导入", "证据读图", "机制讲解", "互动总结"],
      "interactionMoments": ["开场提问", "读图追问", "低碳行动讨论"],
      "pacePlan": "控制在 35-40 分钟，读图和讨论留足时间。"
    },
    "afterClass": {
      "summary": "学生能用证据说明气候变化并提出低碳行动。",
      "homework": ["完成读图练习", "设计一条校园低碳建议"],
      "reflection": "复盘学生是否能区分天气现象和气候趋势。"
    }
  },
  "afterClassSummary": {
    "classSummary": "本节课围绕证据、原因、影响和应对建立气候变化分析框架。",
    "studentTakeaways": ["能读懂气温和二氧化碳变化趋势", "能解释温室效应增强"],
    "teacherReflection": "下次可增加本地案例，让学生更容易建立现实联系。",
    "nextLessonSuggestion": "下一节可衔接区域环境问题或低碳发展。"
  },
  "homeworkPlan": {
    "basicHomework": ["整理本课概念框架", "完成一题读图题"],
    "advancedHomework": ["分析一个地区受气候变化影响的案例"],
    "optionalTask": "设计一张校园低碳行动海报。",
    "estimatedTime": "20分钟"
  },
  "teachingReflection": {
    "possibleProblems": ["学生可能把短期天气当作气候变化", "读图时忽略坐标单位"],
    "adjustmentSuggestions": ["增加读图示范", "用追问帮助学生说出证据"],
    "studentMisconceptions": ["一次高温就能证明全球变暖"],
    "reteachSuggestion": "下次课前用 3 分钟复习天气与气候的区别。"
  },
  "slides": [
    {
      "title": "气候变化是什么？",
      "content": ["全球气温变化趋势", "温室气体增加", "人类活动影响"],
      "teacherNote": "引导学生观察近百年气温变化曲线。",
      "question": "你认为气候变化和我们的生活有什么关系？",
      "imagePrompt": "全球变暖、地球、温室效应、气候变化、高清课堂投影、科技感",
      "duration": "5分钟",
      "interactionCount": 1,
      "paceTip": "建议此处停顿并提问",
      "teacherTip": "建议此处进入课堂讨论，让学生先说现象再归纳概念。",
      "discussionPrompt": "分组讨论：气候变化会先影响生活中的哪些场景？",
      "boardWriting": ["一、气候变化的表现", "二、证据来自长期观测"],
      "speakerScript": {
        "opening": "同学们，先想一想，最近几年你感受到天气有什么变化？",
        "explanation": "这一页我们不是急着下结论，而是把生活感受转化为可以验证的地理问题。",
        "transition": "有了问题，下一步就要看证据是否支持我们的判断。",
        "boardWriting": ["气候变化：长期趋势", "分析路径：证据-原因-影响"],
        "commonMistakes": ["把一次天气现象当作气候变化", "只说变热，不说明证据"]
      },
      "paceControl": {
        "duration": "5分钟",
        "explainTime": "3分钟",
        "questionTime": "2分钟",
        "interactionType": "提问",
        "paceWarning": "本页不要讲太满，重点让学生先说出现象。"
      },
      "questionGuide": {
        "warmUpQuestion": "你最近感受到哪些异常天气？",
        "deepQuestion": "这些感受怎样才能转化为科学证据？",
        "followUpQuestion": "一次高温能不能证明全球变暖？为什么？",
        "expectedAnswer": "不能。需要长期、多地区、连续观测的数据趋势。"
      },
      "geoModule": {
        "mapFocus": "全球不同纬度地区的增温差异",
        "caseStudy": "冰川退缩与海平面上升",
        "realWorldConnection": "联系城市高温、农业生产和校园低碳行动"
      },
      "speakerAssistant": {
        "talkScript": "先用生活现象导入，再把学生观察收束到气候变化的核心问题。",
        "keyPoints": ["区分天气与气候", "建立证据意识"],
        "studentQuestions": ["一次高温能证明全球变暖吗？"],
        "teacherAnswers": ["不能。需要看长期、多地区、连续观测的数据趋势。"]
      },
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

type DemoSlide = Omit<
  Slide,
  "boardWriting" | "speakerScript" | "paceControl" | "questionGuide"
> &
  Partial<
    Pick<
      Slide,
      | "boardWriting"
      | "speakerScript"
      | "paceControl"
      | "questionGuide"
      | "geoModule"
      | "mathModule"
      | "historyModule"
      | "englishModule"
    >
  >;

type DemoTeachingPlan = Omit<TeachingPlan, "slides"> & {
  slides: DemoSlide[];
};

function minutesFrom(duration: string) {
  const match = duration.match(/\d+/);
  return match ? Number(match[0]) : 4;
}

function enhanceSlide(slide: DemoSlide, index: number, total: number): Slide {
  const boardWriting =
    slide.boardWriting && slide.boardWriting.length > 0
      ? slide.boardWriting
      : [
          `一、${slide.title}`,
          ...slide.content.slice(0, 2).map((item, itemIndex) => `${itemIndex + 2}、${item}`)
        ].slice(0, 4);
  const duration = slide.duration || `${index === 0 ? 4 : 5}分钟`;
  const minutes = minutesFrom(duration);
  const questionTime = Math.max(1, Math.min(2, slide.interactionCount || 1));
  const explainTime = Math.max(1, minutes - questionTime);

  return {
    ...slide,
    boardWriting,
    speakerScript: slide.speakerScript || {
      opening: `同学们，我们先看“${slide.title}”，想一想它和今天的核心问题有什么关系。`,
      explanation: slide.speakerAssistant.talkScript || slide.teacherNote,
      transition:
        index === total - 1
          ? "最后我们把这节课的结论收束成一条清晰的分析路径。"
          : "带着这个判断，我们继续看下一页的证据或案例。",
      boardWriting,
      commonMistakes: [
        "只记结论，不说明依据",
        "回答问题时没有使用本页关键词"
      ]
    },
    paceControl: slide.paceControl || {
      duration,
      explainTime: `${explainTime}分钟`,
      questionTime: `${questionTime}分钟`,
      interactionType:
        slide.quiz.type === "raiseHand"
          ? "举手互动"
          : slide.quiz.type === "single"
            ? "小测验"
            : "提问",
      paceWarning: slide.paceTip || "本页注意控制讲解时间，留出学生表达。"
    },
    questionGuide: slide.questionGuide || {
      warmUpQuestion: slide.question,
      deepQuestion: slide.discussionPrompt,
      followUpQuestion: "你能用本页证据再补充一个理由吗？",
      expectedAnswer:
        slide.speakerAssistant.teacherAnswers[0] ||
        "回到材料证据，再用本页核心概念说明。"
    }
  };
}

function enhanceTeachingPlan(plan: DemoTeachingPlan): TeachingPlan {
  const slides = plan.slides.map((slide, index) =>
    enhanceSlide(slide, index, plan.slides.length)
  );
  const totalInteractions = slides.reduce(
    (sum, slide) => sum + slide.interactionCount,
    0
  );
  const totalQuestions =
    plan.interactionQuestions.length +
    slides.reduce((sum, slide) => sum + slide.speakerAssistant.studentQuestions.length, 0);
  const totalMinutes = slides.reduce(
    (sum, slide) => sum + minutesFrom(slide.duration),
    0
  );

  const firstSlide = slides[0];
  const keyPoints = slides.flatMap((slide) => slide.content).slice(0, 4);
  const subjectModuleHint =
    firstSlide?.mathModule?.formula ||
    firstSlide?.historyModule?.causeEffect ||
    firstSlide?.englishModule?.sentencePattern ||
    firstSlide?.geoModule?.caseStudy ||
    "本节课核心内容";

  return {
    ...plan,
    slides,
    lessonWorkflow: plan.lessonWorkflow || {
      beforeClass: {
        lessonGoal: plan.lessonPlan[0] || "完成本节课核心目标。",
        keyPoints: keyPoints.length ? keyPoints.slice(0, 3) : ["核心概念", "课堂互动", "总结迁移"],
        materials: ["课堂导入素材", "投影演示页", "随堂互动问题"],
        teacherPreparation: ["确认课堂节奏", "预设学生可能问题", "准备板书关键词"]
      },
      inClass: {
        teachingFlow: ["导入", "新授", "互动", "总结"],
        interactionMoments: slides
          .map((slide) => slide.questionGuide.warmUpQuestion)
          .slice(0, 3),
        pacePlan: `围绕 ${slides.length} 页演示控制节奏，重点页留出互动时间。`
      },
      afterClass: {
        summary: `本节课围绕“${subjectModuleHint}”完成讲解、互动和总结。`,
        homework: plan.homework.slice(0, 2),
        reflection: "课后复盘学生是否能说出关键依据，并记录需要补讲的概念。"
      }
    },
    afterClassSummary: plan.afterClassSummary || {
      classSummary: `本节课围绕“${subjectModuleHint}”组织课堂演示和互动。`,
      studentTakeaways: keyPoints.length ? keyPoints.slice(0, 3) : ["掌握核心概念", "完成课堂表达"],
      teacherReflection: "关注学生是否真正理解关键依据，而不是只记住结论。",
      nextLessonSuggestion: "下一节课可从本节易错点切入，做一次短复习再进入新内容。"
    },
    homeworkPlan: plan.homeworkPlan || {
      basicHomework: plan.homework.slice(0, 2),
      advancedHomework: [plan.homework[2] || "完成一个本课主题的迁移练习。"],
      optionalTask: "选择一个课堂问题，整理成 100 字学习札记。",
      estimatedTime: "20分钟"
    },
    teachingReflection: plan.teachingReflection || {
      possibleProblems: ["学生可能只记结论，忽略推理过程", "课堂互动时间可能被讲解挤压"],
      adjustmentSuggestions: ["保留至少一次追问", "用板书固定核心路径"],
      studentMisconceptions: slides[0]?.speakerScript.commonMistakes.slice(0, 2) || ["概念理解不完整"],
      reteachSuggestion: "下节课开头用 3 分钟复盘本课关键问题和易错点。"
    },
    lessonSummary: plan.lessonSummary || {
      totalDuration: `${totalMinutes || 40}分钟`,
      totalSlides: slides.length,
      totalQuestions,
      totalInteractions,
      teachingStyle: "演示模板"
    }
  };
}

export const demoTeachingPlan: TeachingPlan = enhanceTeachingPlan({
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
      interactionCount: 1,
      paceTip: "开场先停顿 10 秒，让学生说出身边现象。",
      teacherTip: "先让学生举例，再把生活经验收束到本课核心问题。",
      discussionPrompt: "请同桌互相补充一个近年极端天气案例，并判断它能否作为气候变化证据。",
      geoModule: {
        mapFocus: "全球不同纬度地区的增温差异",
        caseStudy: "近年极端高温与城市热岛现象",
        realWorldConnection: "联系校园高温体验和低碳行动"
      },
      speakerAssistant: {
        talkScript: "从学生熟悉的高温、暴雨导入，提醒他们把感受转化为可验证的问题。",
        keyPoints: ["生活现象导入", "天气与气候区分", "提出核心问题"],
        studentQuestions: ["天气变热就等于气候变化吗？"],
        teacherAnswers: ["不完全等同。天气是短期状态，气候变化要看长期趋势和多源证据。"]
      },
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
      interactionCount: 2,
      paceTip: "先读图再解释，至少安排一次追问。",
      teacherTip: "建议切换到读图节奏，追问“先描述，再解释”。",
      discussionPrompt: "小组讨论：如果两条曲线同步上升，能否直接说明因果关系？还需要哪些证据？",
      geoModule: {
        mapFocus: "全球气温观测站与冰川分布区域",
        caseStudy: "冰川退缩作为气候变化旁证",
        realWorldConnection: "联系海平面上升对沿海城市的影响"
      },
      speakerAssistant: {
        talkScript: "带学生按标题、坐标、趋势、异常点读图，再讨论二氧化碳与气温的关系。",
        keyPoints: ["读图顺序", "长期趋势", "相关不等于因果"],
        studentQuestions: ["两条曲线一起上升就一定是因果关系吗？"],
        teacherAnswers: ["还需要机制解释和更多证据，比如温室气体吸收长波辐射的原理。"]
      },
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
      interactionCount: 1,
      paceTip: "讲完机制后停顿，让学生复述能量链条。",
      teacherTip: "此页适合板书“短波进入、长波受阻”的机制链条。",
      discussionPrompt: "请用一句话向同学解释“温室效应增强”的能量传递过程。",
      geoModule: {
        mapFocus: "能源消费高强度地区与排放分布",
        caseStudy: "工业生产和交通排放",
        realWorldConnection: "联系日常能源消费与碳排放"
      },
      speakerAssistant: {
        talkScript: "用能量收支讲清温室效应增强：短波进入地表，长波被温室气体更多吸收。",
        keyPoints: ["短波辐射", "长波辐射", "人类活动增强排放"],
        studentQuestions: ["温室效应是不是坏事？"],
        teacherAnswers: ["自然温室效应维持适宜温度，问题在于人为排放使它过度增强。"]
      },
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
      interactionCount: 2,
      paceTip: "收束前安排快答，把宏观概念落到校园行动。",
      teacherTip: "建议收束为小组快答，用一个校园行动对应一个地理依据。",
      discussionPrompt: "快速讨论：选择一项校园低碳行动，说出它对应的减排或适应逻辑。",
      geoModule: {
        mapFocus: "城市热岛与绿色空间分布",
        caseStudy: "低碳城市与绿色校园",
        realWorldConnection: "设计一项学校低碳行动"
      },
      speakerAssistant: {
        talkScript: "把影响与应对落到学校场景，让学生用地理依据说明一个可执行行动。",
        keyPoints: ["区域影响差异", "减缓与适应", "低碳行动"],
        studentQuestions: ["个人行动对气候变化有用吗？"],
        teacherAnswers: ["个人行动会影响消费和能源使用，更重要的是形成低碳社会选择。"]
      },
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
});

export function getDemoTeachingPlan(input: TeacherInput): TeachingPlan {
  const normalized = `${input.grade}${input.subject}${input.topic}`.toLowerCase();

  if (normalized.includes("历史") || normalized.includes("鸦片")) {
    return enhanceTeachingPlan({
      lessonPlan: [
        "导入：展示鸦片输入与白银外流材料，提出“为什么一场战争改变了中国近代历史？”",
        "新授：从贸易冲突、禁烟运动和英国侵略三个层面梳理鸦片战争爆发原因。",
        "探究：阅读《南京条约》核心条款，分析主权、领土和贸易权的变化。",
        "总结：用“原因-过程-结果-影响”框架理解中国近代史开端。"
      ],
      pptOutline: [
        "第 1 页：历史导入：鸦片输入与白银外流。",
        "第 2 页：战争原因：贸易、禁烟与侵略。",
        "第 3 页：条约影响：《南京条约》与主权变化。",
        "第 4 页：历史意义：中国近代史的开端。"
      ],
      slides: [
        {
          title: "为什么鸦片战争会爆发？",
          content: ["中英贸易结构失衡", "鸦片输入破坏社会与经济", "林则徐虎门销烟成为直接导火线"],
          teacherNote: "先让学生从材料中找关键词，再归纳战争爆发的多重原因。",
          question: "鸦片战争只是因为禁烟引发的吗？",
          imagePrompt: "鸦片战争 清代港口 历史地图 课堂投影",
          duration: "5分钟",
          interactionCount: 1,
          paceTip: "材料读完后停顿，让学生先判断原因层次。",
          teacherTip: "强调直接原因与根本原因的区别。",
          discussionPrompt: "同桌讨论：贸易冲突、禁烟运动、工业扩张哪个更接近根本原因？",
          historyModule: {
            timeline: ["19世纪上半期：鸦片输入增加", "1839年：虎门销烟", "1840年：战争爆发"],
            keyFigures: ["林则徐", "道光帝", "英国侵略者"],
            causeEffect: "工业扩张和贸易利益推动英国以禁烟为借口发动侵略战争。"
          },
          speakerAssistant: {
            talkScript: "从材料入手，引导学生区分直接原因和根本原因，不把战争简单理解为禁烟冲突。",
            keyPoints: ["贸易失衡", "鸦片危害", "根本原因"],
            studentQuestions: ["英国为什么一定要发动战争？"],
            teacherAnswers: ["工业革命后的英国需要市场和原料，禁烟只是侵略扩张的借口之一。"]
          },
          quiz: {
            type: "single",
            question: "鸦片战争爆发的根本原因更接近哪一项？",
            options: ["英国工业扩张需求", "虎门销烟本身", "清朝官员态度"],
            answer: "英国工业扩张需求"
          }
        },
        {
          title: "《南京条约》改变了什么？",
          content: ["割让香港岛", "开放五口通商", "协定关税破坏关税自主权"],
          teacherNote: "把条款与主权损害一一对应，帮助学生建立历史解释能力。",
          question: "为什么协定关税会影响国家主权？",
          imagePrompt: "南京条约 历史文献 中国近代史 课堂展示",
          duration: "6分钟",
          interactionCount: 2,
          paceTip: "讲条款时每讲一条追问一次“损害了什么权利”。",
          teacherTip: "适合板书“条款-影响-主权受损”。",
          discussionPrompt: "小组讨论：哪一条对中国社会影响最深？说明依据。",
          historyModule: {
            timeline: ["1842年：《南京条约》签订", "五口通商", "协定关税"],
            keyFigures: ["清政府代表", "英国代表"],
            causeEffect: "战败导致不平等条约签订，中国主权和贸易权受到破坏。"
          },
          speakerAssistant: {
            talkScript: "不要只背条款，要把条款翻译成国家权利的变化，让学生理解半殖民地化的开端。",
            keyPoints: ["领土主权", "贸易特权", "关税自主"],
            studentQuestions: ["开放通商口岸为什么是问题？"],
            teacherAnswers: ["问题不在贸易本身，而在被迫开放和缺少平等谈判权。"]
          },
          quiz: {
            type: "trueFalse",
            question: "协定关税意味着中国完全保留关税自主权。",
            options: ["正确", "错误"],
            answer: "错误"
          }
        },
        {
          title: "中国近代史的开端",
          content: ["社会性质开始变化", "民族危机加深", "中国被迫卷入世界市场"],
          teacherNote: "收束到历史意义，提醒学生用变化视角理解“开端”。",
          question: "为什么说鸦片战争是中国近代史的开端？",
          imagePrompt: "中国近代史 时间轴 历史课堂 科技感",
          duration: "5分钟",
          interactionCount: 1,
          paceTip: "结尾留 1 分钟让学生用一句话概括历史意义。",
          teacherTip: "公开课场景可用时间轴收束。",
          discussionPrompt: "请用“从……到……”句式概括鸦片战争后的变化。",
          historyModule: {
            timeline: ["战前：传统农业社会", "战后：被迫卷入世界市场", "近代：民族危机加深"],
            keyFigures: ["林则徐", "魏源"],
            causeEffect: "外部侵略与内部危机叠加，中国历史任务开始转向救亡图存。"
          },
          speakerAssistant: {
            talkScript: "用时间轴收束：战争后中国社会性质、外部关系和历史任务都发生改变。",
            keyPoints: ["社会性质变化", "民族危机", "近代史开端"],
            studentQuestions: ["近代史开端是不是只看战争时间？"],
            teacherAnswers: ["不是只看时间点，更重要的是社会结构和历史任务出现转折。"]
          },
          quiz: {
            type: "raiseHand",
            question: "你认为本课最关键的历史变化是哪一类？",
            options: ["主权受损", "经济卷入", "思想觉醒"],
            answer: "开放讨论"
          }
        }
      ],
      interactionQuestions: [
        "鸦片战争的直接原因和根本原因分别是什么？",
        "《南京条约》中哪一条最能体现主权受损？",
        "如何理解鸦片战争是中国近代史的开端？"
      ],
      homework: [
        "用表格整理《南京条约》主要条款及影响。",
        "用 100 字说明鸦片战争爆发的根本原因。",
        "完成一道材料题：结合条约内容分析中国社会变化。"
      ]
    });
  }

  if (normalized.includes("数学") || normalized.includes("分数")) {
    return enhanceTeachingPlan({
      lessonPlan: [
        "导入：用分蛋糕情境复习同分母分数含义。",
        "新授：通过图形模型理解同分母分数加减法规则。",
        "探究：比较异分母分数，初步感受通分的必要性。",
        "练习：用口算、小测和错题辨析巩固算法。"
      ],
      pptOutline: [
        "第 1 页：情境导入：蛋糕还剩多少？",
        "第 2 页：同分母加减法：分母不变，分子相加减。",
        "第 3 页：异分母怎么办：先变成相同的分数单位。",
        "第 4 页：课堂小测：算一算，说一说。"
      ],
      slides: [
        {
          title: "蛋糕还剩多少？",
          content: ["把一个整体平均分成若干份", "分母表示平均分的份数", "分子表示取了几份"],
          teacherNote: "用生活情境激活分数意义，再进入计算。",
          question: "为什么计算前要先看分母？",
          imagePrompt: "fraction cake classroom math colorful projection",
          duration: "4分钟",
          interactionCount: 1,
          paceTip: "先让学生用手势表示分数大小。",
          teacherTip: "强调分数单位，不急着给公式。",
          discussionPrompt: "同桌互说：1/4 和 2/4 的分数单位一样吗？",
          mathModule: {
            formula: "a/n + b/n = (a+b)/n",
            steps: ["确认分母相同", "理解分数单位相同", "只把分子表示的份数相加"],
            exampleProblem: "1/4 + 2/4 = ?",
            solutionHint: "都是以 1/4 为单位，1 份加 2 份等于 3 份。"
          },
          speakerAssistant: {
            talkScript: "先讲清分数单位，学生理解同分母其实是在数同一种小份。",
            keyPoints: ["整体", "平均分", "分数单位"],
            studentQuestions: ["分母为什么不能直接相加？"],
            teacherAnswers: ["分母表示每份大小，大小没有变，只是份数在增加或减少。"]
          },
          quiz: {
            type: "raiseHand",
            question: "3/8 的分数单位是什么？",
            options: ["1/8", "3", "8"],
            answer: "1/8"
          }
        },
        {
          title: "同分母分数加减法",
          content: ["分数单位相同", "分母不变", "分子相加减"],
          teacherNote: "让学生边看图边说算法，避免机械背诵。",
          question: "2/7 + 3/7 为什么等于 5/7？",
          imagePrompt: "fraction bars math classroom diagram technology",
          duration: "6分钟",
          interactionCount: 2,
          paceTip: "讲完规则后立刻做 2 道口算。",
          teacherTip: "应试型可补充约分和易错点。",
          discussionPrompt: "找错：2/5 + 1/5 = 3/10 错在哪里？",
          mathModule: {
            formula: "a/n - b/n = (a-b)/n",
            steps: ["看分母", "分母不变", "分子相加减", "能约分时再约分"],
            exampleProblem: "2/7 + 3/7 = ?",
            solutionHint: "分母表示分数单位，单位不变，份数相加。"
          },
          speakerAssistant: {
            talkScript: "把同分母看作相同单位的计数，重点纠正分母相加的常见错误。",
            keyPoints: ["同单位计数", "分母不变", "易错辨析"],
            studentQuestions: ["什么时候分母会变？"],
            teacherAnswers: ["当分数单位不同时，要先转化成相同单位，也就是通分。"]
          },
          quiz: {
            type: "single",
            question: "1/6 + 4/6 = ?",
            options: ["5/6", "5/12", "4/6"],
            answer: "5/6"
          }
        },
        {
          title: "异分母要先统一单位",
          content: ["分数单位不同不能直接加减", "可借助图形找到相同单位", "为后续通分做准备"],
          teacherNote: "当前只做直观理解，不展开复杂通分。",
          question: "1/2 和 1/4 为什么不能直接把分子相加？",
          imagePrompt: "fraction comparison math blocks classroom projection",
          duration: "5分钟",
          interactionCount: 1,
          paceTip: "让学生用图形说明，而不是只说公式。",
          teacherTip: "互动型可安排学生上台摆图形。",
          discussionPrompt: "用画图解释：1/2 + 1/4 应该先把 1/2 看成几个 1/4？",
          mathModule: {
            formula: "异分母加减：先统一分数单位",
            steps: ["观察分数单位", "借助图形转化", "统一单位后再加减"],
            exampleProblem: "1/2 + 1/4 = ?",
            solutionHint: "先把 1/2 看成 2/4，再和 1/4 相加。"
          },
          speakerAssistant: {
            talkScript: "用图形把不同分数单位转化为相同单位，让学生为通分建立直觉。",
            keyPoints: ["单位不同", "图形转化", "通分直觉"],
            studentQuestions: ["异分母一定要通分吗？"],
            teacherAnswers: ["做加减时需要统一分数单位，通分就是常用方法。"]
          },
          quiz: {
            type: "trueFalse",
            question: "异分母分数加减时可以直接分子相加、分母相加。",
            options: ["正确", "错误"],
            answer: "错误"
          }
        }
      ],
      interactionQuestions: [
        "同分母分数加减为什么分母不变？",
        "分母相加是哪个地方理解错了？",
        "异分母分数为什么要先统一分数单位？"
      ],
      homework: [
        "完成 8 道同分母分数加减口算。",
        "写出一道易错题，并说明错误原因。",
        "用图形解释 1/2 + 1/4。"
      ]
    });
  }

  if (normalized.includes("英语") || normalized.includes("过去时")) {
    return enhanceTeachingPlan({
      lessonPlan: [
        "导入：用 yesterday / last weekend 等时间状语唤起学生生活表达。",
        "新授：通过例句归纳一般过去时结构和动词过去式变化。",
        "操练：跟读、替换句型和两人对话，完成过去经历表达。",
        "输出：用 3 句话描述自己的上周末。"
      ],
      pptOutline: [
        "第 1 页：Warm-up：What did you do yesterday?",
        "第 2 页：Grammar：一般过去时结构。",
        "第 3 页：Practice：动词过去式与句型替换。",
        "第 4 页：Speaking：Weekend dialogue."
      ],
      slides: [
        {
          title: "What did you do yesterday?",
          content: ["用 yesterday 引出过去时间", "用 did 提问过去行为", "学生用短句回答"],
          teacherNote: "先让学生跟读问题，再用手势提示过去时间。",
          question: "What did you do yesterday?",
          imagePrompt: "English classroom yesterday speaking practice students projection",
          duration: "4分钟",
          interactionCount: 2,
          paceTip: "先跟读，再点名两位学生用短句回答。",
          teacherTip: "口语型课堂要先开口，不急着讲规则。",
          discussionPrompt: "Pair work: ask and answer with your partner.",
          englishModule: {
            vocabulary: ["yesterday", "played", "visited", "watched"],
            sentencePattern: "What did you do yesterday? I watched TV.",
            speakingTask: "Ask your partner one past activity question.",
            dialogue: ["A: What did you do yesterday?", "B: I watched TV."]
          },
          speakerAssistant: {
            talkScript: "先把学生带入口语情境，用 yesterday 让他们感知过去时间，再自然引出 did。",
            keyPoints: ["past time", "did question", "short answer"],
            studentQuestions: ["为什么这里用 did？"],
            teacherAnswers: ["did 帮助我们提问过去发生的动作。"]
          },
          quiz: {
            type: "raiseHand",
            question: "Which word shows past time?",
            options: ["yesterday", "now", "tomorrow"],
            answer: "yesterday"
          }
        },
        {
          title: "Past Simple Structure",
          content: ["主语 + 动词过去式", "一般疑问句用 Did", "否定句用 didn't"],
          teacherNote: "用三组例句归纳结构，不要先背长规则。",
          question: "How do we ask a past question?",
          imagePrompt: "English grammar past simple sentence pattern classroom",
          duration: "6分钟",
          interactionCount: 1,
          paceTip: "讲完结构立刻做句型替换。",
          teacherTip: "板书肯定句、疑问句、否定句三行结构。",
          discussionPrompt: "Change: I play football. -> I played football yesterday.",
          englishModule: {
            vocabulary: ["played", "cleaned", "visited", "didn't"],
            sentencePattern: "Did you + verb...? Yes, I did. / No, I didn't.",
            speakingTask: "Make two Did you questions.",
            dialogue: ["A: Did you play football?", "B: Yes, I did."]
          },
          speakerAssistant: {
            talkScript: "用例句让学生发现结构：陈述句看动词过去式，提问时 did 放到前面。",
            keyPoints: ["verb-ed", "Did questions", "didn't"],
            studentQuestions: ["用了 did 后动词还要加 ed 吗？"],
            teacherAnswers: ["不用。Did 后面用动词原形。"]
          },
          quiz: {
            type: "single",
            question: "Choose the right sentence.",
            options: ["Did you played?", "Did you play?", "Do you played?"],
            answer: "Did you play?"
          }
        },
        {
          title: "Weekend Dialogue",
          content: ["用过去时间状语", "完成两轮问答", "用 one more question 追问细节"],
          teacherNote: "让学生两人一组完成对话，教师只给关键词提示。",
          question: "Can you ask one more question?",
          imagePrompt: "English speaking dialogue pair work classroom",
          duration: "6分钟",
          interactionCount: 2,
          paceTip: "给学生 2 分钟对话时间，再邀请一组展示。",
          teacherTip: "互动型课堂要留出真实开口时间。",
          discussionPrompt: "Pair work: talk about your last weekend.",
          englishModule: {
            vocabulary: ["last weekend", "went", "saw", "had"],
            sentencePattern: "What did you do last weekend? I went to...",
            speakingTask: "Make a 4-line weekend dialogue.",
            dialogue: [
              "A: What did you do last weekend?",
              "B: I went to the park.",
              "A: Did you have fun?",
              "B: Yes, I did."
            ]
          },
          speakerAssistant: {
            talkScript: "把语法落到真实对话里，让学生用过去时讲自己的周末经历。",
            keyPoints: ["time phrase", "pair work", "follow-up question"],
            studentQuestions: ["不会说某个动词过去式怎么办？"],
            teacherAnswers: ["先用已学动词表达，也可以查词表后再替换。"]
          },
          quiz: {
            type: "trueFalse",
            question: "After did, we use the base form of the verb.",
            options: ["True", "False"],
            answer: "True"
          }
        }
      ],
      interactionQuestions: [
        "What did you do yesterday?",
        "How do we make a Did you question?",
        "Can you ask one follow-up question?"
      ],
      homework: [
        "Write five past simple sentences.",
        "Make a short weekend dialogue.",
        "Circle the past time words in the sentences."
      ]
    });
  }

  return demoTeachingPlan;
}
