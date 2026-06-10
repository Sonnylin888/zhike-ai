"use client";

import { appendWatermark } from "@/lib/watermark";

export function exportWord(content: string, watermark: string) {
  return appendWatermark(content, watermark);
}
