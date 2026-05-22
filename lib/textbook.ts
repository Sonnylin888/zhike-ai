import climateTextbook from "@/data/geography-pep-climate.json";

export type TeacherInput = {
  grade: string;
  subject: string;
  topic: string;
  textbookVersion: string;
  teachingStyle?: string;
};

export type TextbookContent = typeof climateTextbook;

function includesAny(value: string, keywords: string[]) {
  const normalized = value.trim().toLowerCase();
  return keywords.some((keyword) =>
    normalized.includes(keyword.trim().toLowerCase())
  );
}

export function findTextbookContent(input: TeacherInput): TextbookContent {
  const topicMatched = includesAny(input.topic, climateTextbook.topicKeywords);
  const subjectMatched = input.subject.includes(climateTextbook.subject);
  const versionMatched = input.textbookVersion.includes(climateTextbook.publisher);

  if (topicMatched && subjectMatched && versionMatched) {
    return climateTextbook;
  }

  return {
    ...climateTextbook,
    textbookSummary:
      "当前 Demo 教材库仅内置高中地理人教版气候变化样本。以下内容将按该样本辅助生成，建议演示时输入“高中地理｜人教版｜气候变化”。"
  };
}
