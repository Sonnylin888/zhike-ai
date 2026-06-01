import "server-only";

import fs from "node:fs";
import path from "node:path";

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

function stripQuotes(value: string) {
  return value.trim().replace(/^(['"])(.*)\1$/, "$2").trim();
}

function readLocalEnv(key: string) {
  const runtimeValue = process.env[key]?.trim();
  if (runtimeValue) return stripQuotes(runtimeValue);

  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const content = fs.readFileSync(envPath, "utf8");
    const line = content
      .split(/\r?\n/)
      .find((item) => item.trim().startsWith(`${key}=`));

    if (!line) return undefined;
    return stripQuotes(line.split("=").slice(1).join("="));
  } catch {
    return undefined;
  }
}

export function getDeepSeekConfig(): DeepSeekConfig {
  const apiKey = readLocalEnv("DEEPSEEK_API_KEY") || null;
  const baseUrl = (readLocalEnv("DEEPSEEK_BASE_URL") || DEEPSEEK_BASE_URL).replace(/\/+$/, "");
  const model = readLocalEnv("DEEPSEEK_MODEL") || DEEPSEEK_MODEL;
  const timeoutMs = Number(readLocalEnv("DEEPSEEK_TIMEOUT_MS")) || DEEPSEEK_TIMEOUT_MS;

  return {
    apiKey,
    apiKeyConfigured: Boolean(apiKey),
    baseUrl,
    endpoint: `${baseUrl}/chat/completions`,
    model,
    timeoutMs,
    mockMode: !apiKey
  };
}
