"use client";

import { getCurrentUser } from "@/lib/auth";

export function getWatermarkText(watermark?: string) {
  return watermark || getCurrentUser()?.watermark || "智课AI演示版";
}

export function appendWatermark(content: string, watermark?: string) {
  return `${content.trim()}\n\n由智课AI生成｜${getWatermarkText(watermark)}`;
}
