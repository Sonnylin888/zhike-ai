import type { Slide } from "@/lib/prompt";
import { EnglishModuleCard } from "@/components/EnglishModuleCard";
import { GeoModuleCard } from "@/components/GeoModuleCard";
import { HistoryModuleCard } from "@/components/HistoryModuleCard";
import { MathModuleCard } from "@/components/MathModuleCard";

export function SubjectModuleCard({ slide }: { slide: Slide }) {
  if (slide.mathModule) return <MathModuleCard module={slide.mathModule} />;
  if (slide.historyModule) return <HistoryModuleCard module={slide.historyModule} />;
  if (slide.englishModule) return <EnglishModuleCard module={slide.englishModule} />;
  if (slide.geoModule) return <GeoModuleCard module={slide.geoModule} />;
  return null;
}
