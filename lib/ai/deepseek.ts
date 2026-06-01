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

type DeepSeekTextRequest = {
  systemPrompt?: string;
  userPrompt: string;
  fallback: string;
};

export type DeepSeekJsonResult<T> = {
  data: T;
  source: "ai" | "demo-fallback" | "ai-fallback";
  message: string;
  status: DeepSeekRequestStatus;
};

export type DeepSeekTextResult = {
  content: string;
  source: "ai" | "demo-fallback" | "ai-fallback";
  message: string;
  status: DeepSeekRequestStatus;
  model: string;
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

async function requestDeepSeekContent({
  systemPrompt,
  userPrompt,
  jsonMode
}: {
  systemPrompt: string;
  userPrompt: string;
  jsonMode: boolean;
}) {
  const config = getDeepSeekConfig();
  if (!config.apiKey) {
    throw new Error("DEEPSEEK_API_KEY missing");
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
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
        temperature: 0.35,
        max_tokens: jsonMode ? 2600 : 120,
        stream: false
      }),
      signal: controller.signal
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("DeepSeek HTTP error", {
        status: response.status,
        responseError: payload?.error?.message || payload?.error || "unknown",
        model: config.model,
        baseUrl: config.baseUrl,
        hasApiKey: Boolean(config.apiKey),
        apiKeyPrefix: config.apiKey.slice(0, 6)
      });
      throw new Error(getHttpErrorMessage(response.status));
    }

    const content = payload?.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new Error("DeepSeek 未返回内容，已使用 Demo 内容继续演示。");
    }

    return content;
  } catch (error) {
    console.error("DeepSeek request failed", {
      error: error instanceof Error ? error.message : "unknown",
      model: config.model,
      baseUrl: config.baseUrl,
      hasApiKey: Boolean(config.apiKey),
      apiKeyPrefix: config.apiKey.slice(0, 6)
    });
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateDeepSeekText({
  systemPrompt = "你是智课 AI，专注为老师生成可直接上课使用的教学内容。",
  userPrompt,
  fallback
}: DeepSeekTextRequest): Promise<DeepSeekTextResult> {
  const config = getDeepSeekConfig();

  if (!config.apiKey) {
    const message = "DEEPSEEK_API_KEY missing";
    return {
      content: fallback,
      source: "demo-fallback",
      message,
      status: setLatestRequestStatus("mock", message),
      model: config.model
    };
  }

  try {
    const content = await requestDeepSeekContent({ systemPrompt, userPrompt, jsonMode: false });
    const message = "DeepSeek V4 Flash 请求成功。";
    return {
      content,
      source: "ai",
      message,
      status: setLatestRequestStatus("success", message),
      model: config.model
    };
  } catch (error) {
    const message = getRequestErrorMessage(error);
    return {
      content: fallback,
      source: "ai-fallback",
      message,
      status: setLatestRequestStatus("error", message),
      model: config.model
    };
  }
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

  try {
    const content = await requestDeepSeekContent({
      systemPrompt,
      userPrompt,
      jsonMode: true
    });

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
  }
}
