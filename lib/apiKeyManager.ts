"use client";

import { readStorageList, upsertById, writeStorageList } from "@/lib/adminStorage";

export type ApiKeyConfig = {
  id: string;
  provider: string;
  name: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  enabled: boolean;
};

export const apiKeysStorageKey = "zhike_api_keys";

const defaultApiKeys: ApiKeyConfig[] = [
  {
    id: "deepseek_default",
    provider: "deepseek",
    name: "DeepSeek 主Key",
    apiKey: "",
    baseUrl: "https://api.deepseek.com",
    model: "deepseek-v4-flash",
    enabled: true
  }
];

export function getApiKeys() {
  return readStorageList<ApiKeyConfig>(apiKeysStorageKey, defaultApiKeys);
}

export function saveApiKeys(keys: ApiKeyConfig[]) {
  writeStorageList(apiKeysStorageKey, keys);
}

export function saveApiKey(key: ApiKeyConfig) {
  saveApiKeys(upsertById(getApiKeys(), key));
}

export function maskApiKey(apiKey: string) {
  if (!apiKey) return "未配置";
  if (apiKey.length <= 10) return `${apiKey.slice(0, 2)}****`;
  return `${apiKey.slice(0, 7)}****${apiKey.slice(-4)}`;
}
