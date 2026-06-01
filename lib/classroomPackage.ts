export type ClassroomPackage = {
  title: string;
  lessonPlan: string;
  pptOutline: string[];
  questions: string[];
  activities: string[];
  homework: string[];
  blackboard: string;
  review: string;
};

function toText(value: unknown, fallback = "") {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(String).join("\n").trim();
  if (value && typeof value === "object") return JSON.stringify(value);
  return fallback;
}

function toStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\r?\n/)
      .map((item) => item.replace(/^\s*(?:[-*]|\d+[.)、])\s*/, "").trim())
      .filter(Boolean);
  }
  return [];
}

export function normalizeClassroomPackage(data: unknown): ClassroomPackage {
  const response = data && typeof data === "object" ? data as Record<string, unknown> : {};
  const contentValue = response.content ?? data;
  const content = contentValue && typeof contentValue === "object" && !Array.isArray(contentValue)
    ? contentValue as Record<string, unknown>
    : {};
  const rawContent = toText(response.rawContent);
  const stringContent = typeof contentValue === "string" ? contentValue : "";

  return {
    title: toText(content.title, "AI 课堂包"),
    lessonPlan: toText(content.lessonPlan, stringContent || rawContent),
    pptOutline: toStringArray(content.pptOutline),
    questions: toStringArray(content.questions ?? content.interactionQuestions),
    activities: toStringArray(content.activities),
    homework: toStringArray(content.homework),
    blackboard: toText(content.blackboard),
    review: toText(content.review)
  };
}
