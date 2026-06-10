"use client";

import { appendWatermark } from "@/lib/watermark";

export function exportTxt(content: string, watermark: string) {
  return appendWatermark(content, watermark);
}
