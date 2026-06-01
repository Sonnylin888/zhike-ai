import { getDeepSeekConfig } from "@/lib/ai/config";

export type DeepSeekRequestState = "idle" | "success" | "mock" | "error";

export type DeepSeekRequestStatus = {
  state: DeepSeekRequestState;
  message: string;
  updatedAt: string | null;
  statusCode?: number;
};

type DeepSeekJsonRequest<T> = {
  systemPrompt?: string;
  userPrompt: string;
  fallback: () => T;
  isValid?: (data: T) => boolean;
};

export type DeepSeekJsonResult<T> = {
  data: T;
  source: "ai" | "demo-fallback" | "ai-fallback";
  message: string;
  status: DeepSeekRequestStatus;
};

let latestRequestStatus: DeepSeekRequestStatus = {
  state: "idle",
  message: "尚未发起 AI 请求。",
  updatedAt: null
};

function setLatestRequestStatus(
  state: DeepSeekRequestState,
  message: string,
  statusCode?: number
) {
  latestRequestStatus = {
    state,
    message,
    updatedAt: new Date().toISOString(),
    ...(statusCode ? { statusCode } : {})
  };

  return latestRequestStatus;
}

export function getLatestDeepSeekRequestStatus() {
  return latestRequestStatus;
}

function extractJson(content: string) {
  return content
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();
}

function getHttpErrorMessage(status: number) {
  if (status === 401) return "DeepSeek API Key 错误，已使用 Demo 内容继续演示。";
  if (status === 402) return "DeepSeek 余额不足，已使用 Demo 内容继续演示。";
  if (status === 429) return "DeepSeek 请求过快，请稍后再试。已使用 Demo 内容继续演示。";
  return `DeepSeek 服务暂时不可用（HTTP ${status}），已使用 Demo 内容继续演示。`;
}

function getRequestErrorMessage(error: unknown) {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "DeepSeek 请求超时，已使用 Demo 内容继续演示。";
  }

  if (error instanceof SyntaxError) {
    return "DeepSeek 返回内容解析失败，已使用 Demo 内容继续演示。";
  }

  if (error instanceof TypeError) {
    return "DeepSeek 连接失败，请检查网络。已使用 Demo 内容继续演示。";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "DeepSeek 连接失败，已使用 Demo 内容继续演示。";
}

export async function generateDeepSeekJson<T>({
  systemPrompt = "你是智课 AI，专注为老师生成严谨、实用的教学内容。你只输出可解析 JSON。",
  userPrompt,
  fallback,
  isValid
}: DeepSeekJsonRequest<T>): Promise<DeepSeekJsonResult<T>> {
  const config = getDeepSeekConfig();

  if (!config.apiKey) {
    const message = "未配置 DeepSeek API Key，已使用 Demo 内容继续演示。";
    return {
      data: fallback(),
      source: "demo-fallback",
      message,
      status: setLatestRequestStatus("mock", message)
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        thinking: { type: "disabled" },
        response_format: { type: "json_object" },
        temperature: 0.35,
        max_tokens: 2600,
        stream: false
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const message = getHttpErrorMessage(response.status);
      return {
        data: fallback(),
        source: "ai-fallback",
        message,
        status: setLatestRequestStatus("error", message, response.status)
      };
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;

    if (!content) {
      const message = "DeepSeek 未返回内容，已使用 Demo 内容继续演示。";
      return {
        data: fallback(),
        source: "ai-fallback",
        message,
        status: setLatestRequestStatus("error", message)
      };
    }

    const data = JSON.parse(extractJson(content)) as T;
    if (isValid && !isValid(data)) {
      const message = "DeepSeek 返回结构不完整，已使用 Demo 内容继续演示。";
      return {
        data: fallback(),
        source: "ai-fallback",
        message,
        status: setLatestRequestStatus("error", message)
      };
    }

    const message = "DeepSeek V4 Flash 请求成功。";
    return {
      data,
      source: "ai",
      message,
      status: setLatestRequestStatus("success", message)
    };
  } catch (error) {
    const message = getRequestErrorMessage(error);
    console.error("DeepSeek generation failed, using demo fallback:", error);

    return {
      data: fallback(),
      source: "ai-fallback",
      message,
      status: setLatestRequestStatus("error", message)
    };
  } finally {
    clearTimeout(timeout);
  }
}
