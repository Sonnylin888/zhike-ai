"use client";

import { appendWatermark } from "@/lib/watermark";

export function exportMarkdown(content: string, watermark: string) {
  return appendWatermark(content, watermark);
}
