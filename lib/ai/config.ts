export const DEEPSEEK_BASE_URL = "https://api.deepseek.com";
export const DEEPSEEK_MODEL = "deepseek-v4-flash";
export const DEEPSEEK_CHAT_COMPLETIONS_URL = `${DEEPSEEK_BASE_URL}/chat/completions`;
export const DEEPSEEK_TIMEOUT_MS = 25000;

type ApiKeySource =
  | "DEEPSEEK_API_KEY"
  | "DEEPSEEK_KEY"
  | "AI_API_KEY"
  | "OPENAI_API_KEY"
  | null;

export type DeepSeekConfig = {
  apiKey: string | null;
  apiKeySource: ApiKeySource;
  apiKeyConfigured: boolean;
  baseURL: string;
  endpoint: string;
  model: string;
  timeoutMs: number;
  mockMode: boolean;
};

export function getDeepSeekConfig(): DeepSeekConfig {
  const candidates = [
    ["DEEPSEEK_API_KEY", process.env.DEEPSEEK_API_KEY],
    ["DEEPSEEK_KEY", process.env.DEEPSEEK_KEY],
    ["AI_API_KEY", process.env.AI_API_KEY],
    ["OPENAI_API_KEY", process.env.OPENAI_API_KEY]
  ] as const;
  const match = candidates.find(([, value]) => value?.trim());
  const apiKey = match?.[1]?.trim() || null;

  return {
    apiKey,
    apiKeySource: match?.[0] || null,
    apiKeyConfigured: Boolean(apiKey),
    baseURL: DEEPSEEK_BASE_URL,
    endpoint: DEEPSEEK_CHAT_COMPLETIONS_URL,
    model: DEEPSEEK_MODEL,
    timeoutMs: DEEPSEEK_TIMEOUT_MS,
    mockMode: !apiKey
  };
}
