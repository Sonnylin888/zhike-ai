import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  buildTeachingPrompt,
  getDemoTeachingPlan,
  type Slide,
  type TeachingPlan
} from "@/lib/prompt";
import { findTextbookContent, type TeacherInput } from "@/lib/textbook";

export const runtime = "nodejs";

function isValidInput(input: Partial<TeacherInput>) {
  return Boolean(
    input.grade?.trim() &&
      input.subject?.trim() &&
      input.topic?.trim() &&
      input.textbookVersion?.trim()
  );
}

function parseTeachingPlan(content: string): TeachingPlan {
  const cleaned = content
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();
  return normalizeTeachingPlan(JSON.parse(cleaned) as Partial<TeachingPlan>);
}

function normalizeTeachingPlan(plan: Partial<TeachingPlan>): TeachingPlan {
  const lessonPlan = Array.isArray(plan.lessonPlan) ? plan.lessonPlan : [];
  const pptOutline = Array.isArray(plan.pptOutline) ? plan.pptOutline : [];
  const interactionQuestions = Array.isArray(plan.interactionQuestions)
    ? plan.interactionQuestions
    : [];
  const homework = Array.isArray(plan.homework) ? plan.homework : [];

  const normalizedSlides = normalizeSlides(
    plan.slides,
    pptOutline,
    interactionQuestions
  );

  return {
    lessonPlan,
    pptOutline,
    interactionQuestions,
    homework,
    lessonSummary: normalizeLessonSummary(plan.lessonSummary, normalizedSlides, interactionQuestions),
    slides: normalizedSlides
  };
}

function normalizeSlides(
  slides: TeachingPlan["slides"] | undefined,
  pptOutline: string[],
  interactionQuestions: string[]
): Slide[] {
  if (Array.isArray(slides) && slides.length > 0) {
    return slides.slice(0, 8).map((slide, index) => ({
      title: slide.title?.trim() || `第 ${index + 1} 页`,
      content: Array.isArray(slide.content)
        ? slide.content.filter(Boolean).slice(0, 4)
        : [],
      teacherNote: slide.teacherNote?.trim() || "结合教材素材，引导学生观察、描述并解释地理现象。",
      question:
        slide.question?.trim() ||
        interactionQuestions[index % Math.max(interactionQuestions.length, 1)] ||
        "你能用今天学到的方法解释这个现象吗？",
      imagePrompt:
        slide.imagePrompt?.trim() ||
        `${slide.title || pptOutline[index] || "地理课堂"}、课堂演示、AI 配图、科技感`,
      duration: slide.duration?.trim() || `${index === 0 ? 4 : 5}分钟`,
      interactionCount:
        typeof slide.interactionCount === "number"
          ? slide.interactionCount
          : index % 2 === 0
            ? 1
            : 2,
      paceTip:
        slide.paceTip?.trim() ||
        "建议此处停顿 10 秒，让学生先表达，再进入讲解。",
      teacherTip:
        slide.teacherTip?.trim() ||
        slide.teacherNote?.trim() ||
        "建议此处进入课堂讨论，先让学生观察，再引导归纳。",
      discussionPrompt:
        slide.discussionPrompt?.trim() ||
        `围绕“${slide.question || slide.title || "本页问题"}”进行 1 分钟同桌讨论，并准备一个证据。`,
      boardWriting: normalizeBoardWriting(slide, index),
      speakerScript: normalizeSpeakerScript(slide, index),
      paceControl: normalizePaceControl(slide, index),
      questionGuide: normalizeQuestionGuide(slide, index),
      speakerAssistant: normalizeSpeakerAssistant(slide, index),
      quiz: normalizeQuiz(slide.quiz, slide.question, index)
    }));
  }

  return pptOutline.map((outline, index) => {
    const title = outline.replace(/^第\s*\d+\s*页[：:]\s*/, "").split(/[：:]/)[0];
    const detail = outline.includes("：")
      ? outline.split("：").slice(1).join("：")
      : outline;

    return {
      title: title || `第 ${index + 1} 页`,
      content: detail
        .split(/[、，,；;]/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 4),
      teacherNote: "围绕本页关键词展开讲解，先让学生观察材料，再归纳地理规律。",
      question:
        interactionQuestions[index % Math.max(interactionQuestions.length, 1)] ||
        "你能从这页材料中发现哪些地理信息？",
      imagePrompt: `${title || detail}、课堂投影、AI 教学、地理可视化`,
      duration: `${index === 0 ? 4 : 5}分钟`,
      interactionCount: index % 2 === 0 ? 1 : 2,
      paceTip: "建议此处停顿并提问，确认学生能说出判断依据。",
      teacherTip: "围绕本页材料做一次短讨论，让学生用地理术语表达判断依据。",
      discussionPrompt: `小组讨论：${interactionQuestions[index] || "本页材料能支持哪些地理判断？"}`,
      boardWriting: normalizeBoardWriting(undefined, index, title || detail),
      speakerScript: normalizeSpeakerScript(undefined, index, title || detail),
      paceControl: normalizePaceControl(undefined, index),
      questionGuide: normalizeQuestionGuide(undefined, index, title || detail),
      speakerAssistant: normalizeSpeakerAssistant(undefined, index, title || detail),
      quiz: normalizeQuiz(undefined, interactionQuestions[index], index)
    };
  });
}

function parseMinutes(duration: string | undefined) {
  const match = duration?.match(/\d+/);
  return match ? Number(match[0]) : 4;
}

function normalizeLessonSummary(
  summary: Partial<NonNullable<TeachingPlan["lessonSummary"]>> | undefined,
  slides: Slide[],
  interactionQuestions: string[]
): NonNullable<TeachingPlan["lessonSummary"]> {
  const totalDuration = slides.reduce(
    (sum, slide) => sum + parseMinutes(slide.duration),
    0
  );
  const totalInteractions = slides.reduce(
    (sum, slide) => sum + slide.interactionCount,
    0
  );

  return {
    totalDuration: summary?.totalDuration?.trim() || `${totalDuration || 40}分钟`,
    totalSlides: summary?.totalSlides || slides.length,
    totalQuestions:
      summary?.totalQuestions ||
      interactionQuestions.length + slides.length,
    totalInteractions: summary?.totalInteractions || totalInteractions,
    teachingStyle: summary?.teachingStyle?.trim() || "AI 课堂"
  };
}

function normalizeBoardWriting(
  slide: Partial<Slide> | undefined,
  index: number,
  fallbackTitle = "本页重点"
): string[] {
  if (Array.isArray(slide?.boardWriting) && slide.boardWriting.length > 0) {
    return slide.boardWriting.filter(Boolean).slice(0, 4);
  }

  const title = slide?.title || fallbackTitle || `第 ${index + 1} 页`;
  return [`一、${title}`, "二、核心证据", "三、课堂结论"];
}

function normalizeSpeakerScript(
  slide: Partial<Slide> | undefined,
  index: number,
  fallbackTitle = "本页内容"
): Slide["speakerScript"] {
  const script = slide?.speakerScript;
  const title = slide?.title || fallbackTitle || `第 ${index + 1} 页`;
  const boardWriting = normalizeBoardWriting(slide, index, title);

  return {
    opening:
      script?.opening?.trim() ||
      `同学们，我们先看“${title}”，用一个问题把这页内容带起来。`,
    explanation:
      script?.explanation?.trim() ||
      slide?.speakerAssistant?.talkScript ||
      slide?.teacherNote ||
      "这一页重点是先观察材料，再说出依据，最后形成课堂结论。",
    transition:
      script?.transition?.trim() ||
      "接下来我们带着这个判断，继续看下一页的证据和应用。",
    boardWriting:
      Array.isArray(script?.boardWriting) && script.boardWriting.length > 0
        ? script.boardWriting.filter(Boolean).slice(0, 4)
        : boardWriting,
    commonMistakes:
      Array.isArray(script?.commonMistakes) && script.commonMistakes.length > 0
        ? script.commonMistakes.filter(Boolean).slice(0, 3)
        : ["只说结论，没有说明依据", "把短期现象当作长期规律"]
  };
}

function normalizePaceControl(
  slide: Partial<Slide> | undefined,
  index: number
): Slide["paceControl"] {
  const pace = slide?.paceControl;
  const duration = pace?.duration?.trim() || slide?.duration || `${index === 0 ? 4 : 5}分钟`;
  const minutes = parseMinutes(duration);
  const questionMinutes = Math.max(1, Math.min(2, slide?.interactionCount || 1));

  return {
    duration,
    explainTime: pace?.explainTime?.trim() || `${Math.max(1, minutes - questionMinutes)}分钟`,
    questionTime: pace?.questionTime?.trim() || `${questionMinutes}分钟`,
    interactionType:
      pace?.interactionType?.trim() ||
      (slide?.quiz?.type === "raiseHand"
        ? "举手互动"
        : slide?.quiz?.type === "single"
          ? "小测验"
          : "提问"),
    paceWarning:
      pace?.paceWarning?.trim() ||
      slide?.paceTip ||
      "本页不要讲太久，重点留时间给学生表达。"
  };
}

function normalizeQuestionGuide(
  slide: Partial<Slide> | undefined,
  index: number,
  fallbackTitle = "本页内容"
): Slide["questionGuide"] {
  const guide = slide?.questionGuide;
  const title = slide?.title || fallbackTitle || `第 ${index + 1} 页`;

  return {
    warmUpQuestion:
      guide?.warmUpQuestion?.trim() ||
      slide?.question ||
      `看到“${title}”，你首先想到什么？`,
    deepQuestion:
      guide?.deepQuestion?.trim() ||
      slide?.discussionPrompt ||
      "这个结论背后有哪些证据可以支持？",
    followUpQuestion:
      guide?.followUpQuestion?.trim() ||
      "你能再补充一个理由或反例吗？",
    expectedAnswer:
      guide?.expectedAnswer?.trim() ||
      slide?.speakerAssistant?.teacherAnswers?.[0] ||
      "应回到材料证据，并用本页核心概念解释。"
  };
}

function normalizeSpeakerAssistant(
  slide: Partial<Slide> | undefined,
  index: number,
  fallbackTitle = "本页内容"
): Slide["speakerAssistant"] {
  const assistant = slide?.speakerAssistant;
  const title = slide?.title || fallbackTitle || `第 ${index + 1} 页`;
  const question = slide?.question || "学生可能会追问本页结论如何得出。";

  return {
    talkScript:
      assistant?.talkScript?.trim() ||
      `围绕“${title}”先讲情境，再引导学生说出证据和结论。`,
    keyPoints:
      Array.isArray(assistant?.keyPoints) && assistant.keyPoints.length > 0
        ? assistant.keyPoints.filter(Boolean).slice(0, 3)
        : [title, "证据解读", "课堂追问"],
    studentQuestions:
      Array.isArray(assistant?.studentQuestions) &&
      assistant.studentQuestions.length > 0
        ? assistant.studentQuestions.filter(Boolean).slice(0, 2)
        : [question],
    teacherAnswers:
      Array.isArray(assistant?.teacherAnswers) && assistant.teacherAnswers.length > 0
        ? assistant.teacherAnswers.filter(Boolean).slice(0, 2)
        : ["先回到材料证据，再用本页核心概念解释。"]
  };
}

function normalizeQuiz(
  quiz: Partial<Slide["quiz"]> | undefined,
  fallbackQuestion: string | undefined,
  index: number
): Slide["quiz"] {
  const quizTypes: Slide["quiz"]["type"][] = ["raiseHand", "single", "trueFalse"];
  const type = quizTypes.includes(quiz?.type as Slide["quiz"]["type"])
    ? (quiz?.type as Slide["quiz"]["type"])
    : quizTypes[index % quizTypes.length];
  const defaults: Record<Slide["quiz"]["type"], Slide["quiz"]> = {
    raiseHand: {
      type: "raiseHand",
      question: fallbackQuestion || "你支持这个判断吗？请用举手表达你的选择。",
      options: ["支持", "不确定", "有不同观点"],
      answer: "开放讨论"
    },
    single: {
      type: "single",
      question: fallbackQuestion || "下列哪项最符合本页的核心结论？",
      options: ["依据材料判断", "只看单一现象", "忽略区域差异"],
      answer: "依据材料判断"
    },
    trueFalse: {
      type: "trueFalse",
      question: fallbackQuestion || "判断：地理结论需要结合证据和区域背景。",
      options: ["正确", "错误"],
      answer: "正确"
    }
  };
  const fallback = defaults[type];

  return {
    type,
    question: quiz?.question?.trim() || fallback.question,
    options: Array.isArray(quiz?.options) && quiz.options.length > 0
      ? quiz.options.filter(Boolean).slice(0, 4)
      : fallback.options,
    answer: quiz?.answer?.trim() || fallback.answer
  };
}

function demoFallbackResponse(
  textbook: ReturnType<typeof findTextbookContent>,
  input: TeacherInput,
  source = "demo-fallback"
) {
  return NextResponse.json({
    plan: getDemoTeachingPlan(input),
    source,
    textbook
  });
}

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as TeacherInput;

    if (!isValidInput(input)) {
      return NextResponse.json(
        { error: "请完整填写学段/年级、学科、课题和教材版本。" },
        { status: 400 }
      );
    }

    const textbook = findTextbookContent(input);
    const prompt = buildTeachingPrompt(input, textbook);
    const openaiApiKey = process.env.OPENAI_API_KEY?.trim();
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY?.trim();
    const isUsingOpenAI = Boolean(openaiApiKey);
    const apiKey = openaiApiKey || deepseekApiKey;
    const baseURL = isUsingOpenAI
      ? process.env.OPENAI_BASE_URL?.trim()
      : process.env.DEEPSEEK_BASE_URL?.trim();
    const model = isUsingOpenAI
      ? process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini"
      : process.env.DEEPSEEK_MODEL?.trim() || "deepseek-v4-flash";

    if (!apiKey) {
      return demoFallbackResponse(textbook, input);
    }

    try {
      const client = new OpenAI({
        apiKey,
        baseURL
      });

      const completion = await client.chat.completions.create({
        model,
        temperature: 0.35,
        max_tokens: 2200,
        messages: [
          {
            role: "system",
            content:
              "你是严谨、务实的高中地理教学设计专家。你只输出可解析 JSON。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0]?.message?.content;

      if (!content) {
        throw new Error("AI 未返回内容");
      }

      return NextResponse.json({
        plan: parseTeachingPlan(content),
        source: "ai",
        textbook
      });
    } catch (aiError) {
      console.error("AI generation failed, using demo fallback:", aiError);
      return demoFallbackResponse(textbook, input, "ai-fallback");
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "生成失败，请稍后重试或检查 API Key 配置。" },
      { status: 500 }
    );
  }
}
