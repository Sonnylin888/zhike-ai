"use client";

import defaultModels from "@/data/models.json";
import { readStorageList, upsertById, writeStorageList } from "@/lib/adminStorage";

export type ModelConfig = {
  id: string;
  provider: string;
  name: string;
  baseUrl: string;
  model: string;
  enabled: boolean;
};

export const modelsStorageKey = "zhike_models";

export function getModels() {
  return readStorageList<ModelConfig>(modelsStorageKey, defaultModels as ModelConfig[]);
}

export function saveModels(models: ModelConfig[]) {
  writeStorageList(modelsStorageKey, models);
}

export function saveModel(model: ModelConfig) {
  saveModels(upsertById(getModels(), model));
}
