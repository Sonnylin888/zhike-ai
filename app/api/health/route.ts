import { NextResponse } from "next/server";
import { getDeepSeekConfig } from "@/lib/ai/config";
import { getLatestDeepSeekRequestStatus } from "@/lib/ai/deepseek";

export const runtime = "nodejs";

export async function GET() {
  const config = getDeepSeekConfig();
  const latestRequest = getLatestDeepSeekRequestStatus();
  const connectionStatus =
    latestRequest.state === "success"
      ? "可用"
      : config.apiKeyConfigured
        ? "等待请求验证"
        : "未配置";

  return NextResponse.json({
    ok: true,
    aiConfigured: config.apiKeyConfigured,
    provider: "deepseek",
    model: config.model,
    baseURL: config.baseURL,
    mockMode: config.mockMode || latestRequest.state === "mock" || latestRequest.state === "error",
    connectionStatus,
    latestRequest
  });
}
