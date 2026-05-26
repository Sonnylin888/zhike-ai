import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const hasDeepSeek = Boolean(process.env.DEEPSEEK_API_KEY?.trim());
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY?.trim());
  const provider = hasDeepSeek ? "deepseek" : hasOpenAI ? "openai" : "demo-fallback";
  const model = hasDeepSeek
    ? process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat"
    : process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  return NextResponse.json({
    ok: true,
    aiConfigured: hasDeepSeek || hasOpenAI,
    provider,
    model
  });
}
