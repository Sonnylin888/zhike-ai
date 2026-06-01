export const DEEPSEEK_BASE_URL = "https://api.deepseek.com";
export const DEEPSEEK_MODEL = "deepseek-v4-flash";
export const DEEPSEEK_TIMEOUT_MS = 25000;

export type DeepSeekConfig = {
  apiKey: string | null;
  apiKeyConfigured: boolean;
  baseUrl: string;
  endpoint: string;
  model: string;
  timeoutMs: number;
  mockMode: boolean;
};

export function getDeepSeekConfig(): DeepSeekConfig {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim() || null;
  const baseUrl = (process.env.DEEPSEEK_BASE_URL?.trim() || DEEPSEEK_BASE_URL).replace(/\/+$/, "");
  const model = process.env.DEEPSEEK_MODEL?.trim() || DEEPSEEK_MODEL;

  return {
    apiKey,
    apiKeyConfigured: Boolean(apiKey),
    baseUrl,
    endpoint: `${baseUrl}/chat/completions`,
    model,
    timeoutMs: DEEPSEEK_TIMEOUT_MS,
    mockMode: !apiKey
  };
}
