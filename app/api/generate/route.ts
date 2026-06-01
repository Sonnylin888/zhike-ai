import { NextResponse } from "next/server";
import { generateDeepSeekText } from "@/lib/ai/deepseek";
import { getDeepSeekConfig } from "@/lib/ai/config";
import { normalizeClassroomPackage } from "@/lib/classroomPackage";
import { buildTeachingPrompt, getDemoTeachingPlan, type TeachingPlan } from "@/lib/prompt";
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

function hasRenderableSlides(plan: Partial<TeachingPlan>) {
  const firstSlide = plan.slides?.[0];
  return Boolean(
    Array.isArray(plan.lessonPlan) &&
      Array.isArray(plan.pptOutline) &&
      Array.isArray(plan.interactionQuestions) &&
      Array.isArray(plan.homework) &&
      Array.isArray(plan.slides) &&
      firstSlide?.title &&
      Array.isArray(firstSlide.content) &&
      firstSlide.speakerScript &&
      firstSlide.paceControl &&
      firstSlide.questionGuide &&
      firstSlide.quiz
  );
}

type ParsedContent = Record<string, unknown>;
type ParseMode = "json" | "text_fallback";

function isParsedObject(value: unknown): value is ParsedContent {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function createTextFallback(content: string, input?: Pick<TeacherInput, "subject" | "topic">): ParsedContent {
  return {
    title: input ? `${input.subject}《${input.topic}》AI课堂包` : "AI 课堂包",
    lessonPlan: content,
    pptOutline: [],
    questions: [],
    activities: [],
    homework: [],
    blackboard: "",
    review: ""
  };
}

function stripMarkdownJsonFence(content: string) {
  return content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function safeParseDeepSeekContent(content: string, input?: Pick<TeacherInput, "subject" | "topic">): {
  content: ParsedContent;
  parseMode: ParseMode;
} {
  if (!content.trim()) {
    throw new Error("DeepSeek 未返回内容。");
  }

  const cleaned = stripMarkdownJsonFence(content);

  try {
    const parsed = JSON.parse(cleaned) as unknown;
    if (isParsedObject(parsed)) {
      return { content: parsed, parseMode: "json" };
    }
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try {
        const parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as unknown;
        if (!isParsedObject(parsed)) throw new Error("JSON result is not an object");
        return {
          content: parsed,
          parseMode: "json"
        };
      } catch {
        // The text wrapper below keeps a successful AI response usable.
      }
    }
  }

  return {
    content: createTextFallback(cleaned, input),
    parseMode: "text_fallback"
  };
}

function toStringArray(value: unknown, fallback: string[] = []) {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\r?\n/)
      .map((item) => item.replace(/^\s*(?:[-*]|\d+[.)、])\s*/, "").trim())
      .filter(Boolean);
  }
  return fallback;
}

function wrapOnlineContentAsTeachingPlan(
  parsed: ParsedContent,
  rawContent: string,
  input: TeacherInput
): TeachingPlan {
  if (hasRenderableSlides(parsed as Partial<TeachingPlan>)) {
    return parsed as TeachingPlan;
  }

  const demo = getDemoTeachingPlan(input);
  const lessonPlan = toStringArray(parsed.lessonPlan, [rawContent.trim()]);
  const pptOutline = toStringArray(parsed.pptOutline, demo.pptOutline);
  const interactionQuestions = toStringArray(
    parsed.interactionQuestions || parsed.questions,
    demo.interactionQuestions
  );
  const homework = toStringArray(parsed.homework, demo.homework);
  const boardWriting = toStringArray(parsed.blackboard, demo.slides[0].boardWriting);
  const title = typeof parsed.title === "string" && parsed.title.trim()
    ? parsed.title.trim()
    : `${input.topic} AI 课堂包`;
  const summary = lessonPlan.join("；").slice(0, 360) || rawContent.trim().slice(0, 360);

  return {
    ...demo,
    lessonPlan,
    pptOutline,
    interactionQuestions,
    homework,
    slides: [
      {
        ...demo.slides[0],
        title,
        content: lessonPlan.slice(0, 4),
        teacherNote: summary,
        boardWriting,
        speakerScript: {
          ...demo.slides[0].speakerScript,
          explanation: summary.slice(0, 180)
        },
        speakerAssistant: {
          ...demo.slides[0].speakerAssistant,
          talkScript: summary.slice(0, 180),
          keyPoints: lessonPlan.slice(0, 3)
        }
      },
      ...demo.slides.slice(1)
    ]
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.type === "connection-test") {
      const result = await generateDeepSeekText({
        userPrompt: body.prompt || "请回复：DeepSeek connected",
        fallback: "当前 AI 服务不可用，已切换至 Demo 模式。"
      });

      return NextResponse.json({
        ok: result.source === "ai",
        mode: result.source === "ai" ? "online" : "demo",
        content: result.content,
        model: result.model,
        modelUsed: result.modelUsed,
        fallbackModelUsed: result.fallbackModelUsed,
        error: result.source === "ai" ? undefined : result.message,
        aiStatus: result.status
      });
    }

    const input = body as TeacherInput;

    if (!isValidInput(input)) {
      return NextResponse.json(
        { error: "请完整填写学段/年级、学科、课题和教材版本。" },
        { status: 400 }
      );
    }

    const textbook = findTextbookContent(input);
    const prompt = buildTeachingPrompt(input, textbook);
    const config = getDeepSeekConfig();
    console.log("Generate request received", {
      grade: input.grade,
      subject: input.subject,
      topic: input.topic,
      style: input.teachingStyle,
      model: config.model
    });
    const result = await generateDeepSeekText({
      systemPrompt: `你是智课 AI，专注为老师生成可直接上课使用的教学内容。
你必须只返回合法 JSON。
不要返回 Markdown。
不要返回 \`\`\`json 代码块。
不要返回解释文字。
JSON 必须完整且可被 JSON.parse 解析。
输出结构必须严格遵循用户提示中的 JSON 格式。`,
      userPrompt: prompt,
      fallback: ""
    });

    if (result.source !== "ai") {
      const demo = getDemoTeachingPlan(input);
      return NextResponse.json({
        ok: false,
        mode: "demo",
        plan: demo,
        content: demo,
        source: result.source,
        message: result.message,
        error: result.message,
        model: config.model,
        modelUsed: result.modelUsed,
        fallbackModelUsed: result.fallbackModelUsed,
        aiStatus: result.status,
        textbook
      });
    }

    const parsed = safeParseDeepSeekContent(result.content, input);
    const classroomPackage = normalizeClassroomPackage({
      content: parsed.content,
      rawContent: result.content
    });
    const plan = wrapOnlineContentAsTeachingPlan(parsed.content, result.content, input);
    console.log("Generate result", {
      ok: true,
      source: "ai",
      parseMode: parsed.parseMode,
      rawLength: result.content.length,
      hasLessonPlan: Boolean(classroomPackage.lessonPlan)
    });

    return NextResponse.json({
      ok: true,
      mode: "online",
      plan,
      content: classroomPackage,
      rawContent: result.content,
      parseMode: parsed.parseMode,
      source: "ai",
      message: result.message,
      model: config.model,
      modelUsed: result.modelUsed,
      fallbackModelUsed: result.fallbackModelUsed,
      aiStatus: result.status,
      textbook
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "生成失败，请稍后重试或检查 API Key 配置。" },
      { status: 500 }
    );
  }
}
