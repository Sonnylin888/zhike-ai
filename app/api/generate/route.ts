import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  buildTeachingPrompt,
  demoTeachingPlan,
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

  return {
    lessonPlan,
    pptOutline,
    interactionQuestions,
    homework,
    slides: normalizeSlides(plan.slides, pptOutline, interactionQuestions)
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
      teacherTip:
        slide.teacherTip?.trim() ||
        slide.teacherNote?.trim() ||
        "建议此处进入课堂讨论，先让学生观察，再引导归纳。",
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
      teacherTip: "围绕本页材料做一次短讨论，让学生用地理术语表达判断依据。",
      quiz: normalizeQuiz(undefined, interactionQuestions[index], index)
    };
  });
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
  source = "demo-fallback"
) {
  return NextResponse.json({
    plan: demoTeachingPlan,
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
      return demoFallbackResponse(textbook);
    }

    try {
      const client = new OpenAI({
        apiKey,
        baseURL
      });

      const completion = await client.chat.completions.create({
        model,
        temperature: 0.35,
        max_tokens: 1400,
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
      return demoFallbackResponse(textbook, "ai-fallback");
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "生成失败，请稍后重试或检查 API Key 配置。" },
      { status: 500 }
    );
  }
}
