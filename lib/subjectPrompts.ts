export function getSubjectPromptStrategy(subject: string) {
  if (subject.includes("数学")) {
    return "数学课要强调步骤、推导、公式、例题和板书过程；每页尽量给出 mathModule。";
  }
  if (subject.includes("历史")) {
    return "历史课要强调时间线、历史背景、事件因果、人物与影响、课堂讨论；每页尽量给出 historyModule。";
  }
  if (subject.includes("英语")) {
    return "英语课要强调单词、句型、跟读、对话和口语互动；每页尽量给出 englishModule。";
  }
  return "地理课要强调地图、案例、区域分析和现实问题讨论；每页尽量给出 geoModule。";
}
