import { NextResponse } from "next/server";
import { generateDeepSeekJson } from "@/lib/ai/deepseek";
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
    const result = await generateDeepSeekJson<TeachingPlan>({
      systemPrompt: "你是智课 AI，专注为老师生成严谨、实用的教学内容。你只输出可解析 JSON。",
      userPrompt: prompt,
      fallback: () => getDemoTeachingPlan(input),
      isValid: hasRenderableSlides
    });

    return NextResponse.json({
      plan: result.data,
      source: result.source,
      message: result.message,
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
