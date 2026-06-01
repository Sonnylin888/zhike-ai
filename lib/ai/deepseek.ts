import { getDeepSeekConfig } from "@/lib/ai/config";

export type DeepSeekRequestState = "idle" | "success" | "mock" | "error";

export type DeepSeekRequestStatus = {
  state: DeepSeekRequestState;
  message: string;
  updatedAt: string | null;
  statusCode?: number;
  modelUsed?: string;
  fallbackModelUsed?: boolean;
};

type DeepSeekTextRequest = {
  systemPrompt?: string;
  userPrompt: string;
  fallback: string;
  jsonMode?: boolean;
  maxTokens?: number;
};

export type DeepSeekTextResult = {
  content: string;
  source: "ai" | "demo-fallback" | "ai-fallback";
  message: string;
  status: DeepSeekRequestStatus;
  model: string;
  modelUsed: string;
  fallbackModelUsed: boolean;
};

let latestRequestStatus: DeepSeekRequestStatus = {
  state: "idle",
  message: "尚未发起 AI 请求。",
  updatedAt: null
};

function setLatestRequestStatus(
  state: DeepSeekRequestState,
  message: string,
  details: Pick<DeepSeekRequestStatus, "statusCode" | "modelUsed" | "fallbackModelUsed"> = {}
) {
  latestRequestStatus = {
    state,
    message,
    updatedAt: new Date().toISOString(),
    ...details
  };

  return latestRequestStatus;
}

export function getLatestDeepSeekRequestStatus() {
  return latestRequestStatus;
}

function getRequestErrorMessage(error: unknown) {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "DeepSeek 请求超时，已使用 Demo 内容继续演示。";
  }

  if (error instanceof TypeError) {
    return "DeepSeek 连接失败，请检查网络。已使用 Demo 内容继续演示。";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "DeepSeek 连接失败，已使用 Demo 内容继续演示。";
}

function stringifyError(value: unknown) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function normalizeContent(content: unknown): string | null {
  if (typeof content === "string") {
    return content.trim() || null;
  }

  if (Array.isArray(content)) {
    const text = content
      .map((item) => {
        if (item && typeof item === "object") {
          if ("text" in item) return normalizeContent(item.text);
          if ("content" in item) return normalizeContent(item.content);
          if ("type" in item && item.type !== "text") return null;
        }
        return normalizeContent(item);
      })
      .filter(Boolean)
      .join("\n")
      .trim();
    return text || null;
  }

  if (content && typeof content === "object") {
    if ("text" in content) {
      const text = normalizeContent(content.text);
      if (text) return text;
    }
    return JSON.stringify(content);
  }

  return null;
}

export function extractDeepSeekContent(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, any>;
  const choice = Array.isArray(data.choices) ? data.choices[0] : undefined;
  const candidates = [
    choice?.message?.content,
    choice?.delta?.content,
    choice?.text,
    data.output_text,
    data.output,
    data.message?.content,
    data.content
  ];

  for (const candidate of candidates) {
    const content = normalizeContent(candidate);
    if (content) return content;
  }

  return null;
}

async function requestDeepSeekOnce({
  systemPrompt,
  userPrompt,
  jsonMode,
  maxTokens,
  model
}: {
  systemPrompt: string;
  userPrompt: string;
  jsonMode: boolean;
  maxTokens?: number;
  model: string;
}) {
  const config = getDeepSeekConfig();
  if (!config.apiKey) throw new Error("DEEPSEEK_API_KEY missing");

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
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        thinking: { type: "disabled" },
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
        temperature: 0.35,
        max_tokens: maxTokens || (jsonMode ? 6000 : 120),
        stream: false
      }),
      signal: controller.signal
    });
    const payload = await response.json().catch(() => null);
    const data = payload && typeof payload === "object" ? payload as Record<string, any> : {};

    console.log("DeepSeek raw response", {
      status: response.status,
      ok: response.ok,
      model,
      hasChoices: Array.isArray(data.choices),
      choice0Keys: data.choices?.[0] ? Object.keys(data.choices[0]) : [],
      messageKeys: data.choices?.[0]?.message ? Object.keys(data.choices[0].message) : [],
      error: data.error
    });

    if (!response.ok) {
      const errorMessage =
        data.error?.message || data.message || stringifyError(data.error) || "unknown error";
      console.error("DeepSeek HTTP error", {
        status: response.status,
        responseError: errorMessage,
        model,
        baseUrl: config.baseUrl,
        hasApiKey: Boolean(config.apiKey),
        apiKeyPrefix: config.apiKey.slice(0, 6)
      });
      throw new Error(`DeepSeek HTTP ${response.status}: ${errorMessage}`);
    }

    return {
      content: extractDeepSeekContent(payload),
      payloadKeys: Object.keys(data)
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function requestDeepSeekContent({
  systemPrompt,
  userPrompt,
  jsonMode,
  maxTokens
}: {
  systemPrompt: string;
  userPrompt: string;
  jsonMode: boolean;
  maxTokens?: number;
}) {
  const config = getDeepSeekConfig();
  if (!config.apiKey) {
    throw new Error("DEEPSEEK_API_KEY missing");
  }

  try {
    const primary = await requestDeepSeekOnce({
      systemPrompt,
      userPrompt,
      jsonMode,
      maxTokens,
      model: config.model
    });
    if (primary.content) {
      return { content: primary.content, modelUsed: config.model, fallbackModelUsed: false };
    }

    if (config.model !== "deepseek-chat") {
      console.warn("DeepSeek response content empty, retrying fallback model", {
        modelUsed: config.model,
        fallbackModel: "deepseek-chat",
        payloadKeys: primary.payloadKeys
      });
      const fallback = await requestDeepSeekOnce({
        systemPrompt,
        userPrompt,
        jsonMode,
        maxTokens,
        model: "deepseek-chat"
      });
      if (fallback.content) {
        return { content: fallback.content, modelUsed: "deepseek-chat", fallbackModelUsed: true };
      }
      throw new Error(`DeepSeek response content empty. Payload keys: ${fallback.payloadKeys.join(",")}`);
    }

    throw new Error(`DeepSeek response content empty. Payload keys: ${primary.payloadKeys.join(",")}`);
  } catch (error) {
    console.error("DeepSeek request failed", {
      error: error instanceof Error ? error.message : "unknown",
      model: config.model,
      baseUrl: config.baseUrl,
      hasApiKey: Boolean(config.apiKey),
      apiKeyPrefix: config.apiKey.slice(0, 6)
    });
    throw error;
  }
}

export async function generateDeepSeekText({
  systemPrompt = "你是智课 AI，专注为老师生成可直接上课使用的教学内容。",
  userPrompt,
  fallback,
  jsonMode = false,
  maxTokens
}: DeepSeekTextRequest): Promise<DeepSeekTextResult> {
  const config = getDeepSeekConfig();

  if (!config.apiKey) {
    const message = "DEEPSEEK_API_KEY missing";
    return {
      content: fallback,
      source: "demo-fallback",
      message,
      status: setLatestRequestStatus("mock", message),
      model: config.model,
      modelUsed: config.model,
      fallbackModelUsed: false
    };
  }

  try {
    const result = await requestDeepSeekContent({ systemPrompt, userPrompt, jsonMode, maxTokens });
    const message = result.fallbackModelUsed
      ? "DeepSeek fallback 模型请求成功。"
      : "DeepSeek V4 Flash 请求成功。";
    return {
      content: result.content,
      source: "ai",
      message,
      status: setLatestRequestStatus("success", message, {
        modelUsed: result.modelUsed,
        fallbackModelUsed: result.fallbackModelUsed
      }),
      model: config.model,
      modelUsed: result.modelUsed,
      fallbackModelUsed: result.fallbackModelUsed
    };
  } catch (error) {
    const message = getRequestErrorMessage(error);
    return {
      content: fallback,
      source: "ai-fallback",
      message,
      status: setLatestRequestStatus("error", message),
      model: config.model,
      modelUsed: config.model,
      fallbackModelUsed: false
    };
  }
}
