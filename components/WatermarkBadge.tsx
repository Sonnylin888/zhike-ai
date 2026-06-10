"use client";

import { ShieldCheck } from "lucide-react";
import { getWatermarkText } from "@/lib/watermark";

export function WatermarkBadge({ watermark }: { watermark?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md bg-cyan-50 px-3 py-1.5 text-sm font-semibold text-cyan-800">
      <ShieldCheck className="h-4 w-4" />
      {getWatermarkText(watermark)}
    </span>
  );
}
