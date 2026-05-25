export type TrialFeedback = {
  role: string;
  subject: string;
  rating: number;
  usefulParts: string[];
  concerns: string;
  suggestions: string;
  createdAt: string;
};

export const trialFeedbackStorageKey = "智课 AI-trial-feedback";

export const feedbackRoles = ["老师", "校长", "信息化主任", "其他"];

export const usefulPartOptions = [
  "AI PPT",
  "讲稿",
  "课堂互动",
  "课后总结",
  "板书建议",
  "作业建议"
];
