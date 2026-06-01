import { NextResponse } from "next/server";
import { getDeepSeekConfig } from "@/lib/ai/config";
import { getLatestDeepSeekRequestStatus } from "@/lib/ai/deepseek";

export const runtime = "nodejs";

export async function GET() {
  const config = getDeepSeekConfig();
  const latestRequest = getLatestDeepSeekRequestStatus();
  const hasApiKey = config.apiKeyConfigured;
  const connectionStatus =
    latestRequest.state === "success"
      ? "可用"
      : config.apiKeyConfigured
        ? "等待请求验证"
        : "未配置";

  return NextResponse.json({
    ok: hasApiKey,
    provider: "deepseek",
    model: config.model,
    hasApiKey,
    baseUrl: config.baseUrl,
    mode: hasApiKey ? "online" : "demo",
    reason: hasApiKey ? undefined : "DEEPSEEK_API_KEY missing",
    connectionStatus,
    latestRequest
  });
}
