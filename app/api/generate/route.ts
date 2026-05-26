import OpenAI from "openai";
import { NextResponse } from "next/server";
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

function extractJson(content: string) {
  return content
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();
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
      : process.env.DEEPSEEK_BASE_URL?.trim() || "https://api.deepseek.com";
    const model = isUsingOpenAI
      ? process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini"
      : process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat";

    if (!apiKey) {
      return demoFallbackResponse(textbook, input);
    }

    try {
      const client = new OpenAI({
        apiKey,
        baseURL,
        timeout: 25000
      });

      const completion = await client.chat.completions.create({
        model,
        temperature: 0.35,
        max_tokens: 2600,
        messages: [
          {
            role: "system",
            content: "你是严谨、务实的一线教学设计专家。你只输出可解析 JSON。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error("AI 未返回内容");

      const plan = JSON.parse(extractJson(content)) as Partial<TeachingPlan>;
      if (!hasRenderableSlides(plan)) {
        throw new Error("AI 返回结构不完整");
      }

      return NextResponse.json({
        plan: plan as TeachingPlan,
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
