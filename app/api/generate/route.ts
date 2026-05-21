import OpenAI from "openai";
import { NextResponse } from "next/server";
import { buildTeachingPrompt, demoTeachingPlan, type TeachingPlan } from "@/lib/prompt";
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
  return JSON.parse(cleaned) as TeachingPlan;
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
      return NextResponse.json({
        plan: demoTeachingPlan,
        source: "demo-fallback",
        textbook
      });
    }

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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "生成失败，请稍后重试或检查 API Key 配置。" },
      { status: 500 }
    );
  }
}
