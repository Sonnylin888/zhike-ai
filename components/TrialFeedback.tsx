"use client";

import { Download, Save, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  feedbackRoles,
  trialFeedbackStorageKey,
  usefulPartOptions,
  type TrialFeedback as TrialFeedbackData
} from "@/lib/trialFeedback";

const defaultFeedback: TrialFeedbackData = {
  role: "老师",
  subject: "地理",
  rating: 5,
  usefulParts: ["AI PPT", "讲稿", "课堂互动"],
  concerns: "",
  suggestions: "",
  createdAt: ""
};

export function TrialFeedback() {
  const [feedback, setFeedback] = useState<TrialFeedbackData>(defaultFeedback);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(trialFeedbackStorageKey);
    if (stored) {
      setFeedback(JSON.parse(stored));
    }
  }, []);

  function updateFeedback(patch: Partial<TrialFeedbackData>) {
    setSaved(false);
    setFeedback((current) => ({ ...current, ...patch }));
  }

  function toggleUsefulPart(part: string) {
    updateFeedback({
      usefulParts: feedback.usefulParts.includes(part)
        ? feedback.usefulParts.filter((item) => item !== part)
        : [...feedback.usefulParts, part]
    });
  }

  function saveFeedback() {
    const nextFeedback = {
      ...feedback,
      createdAt: feedback.createdAt || new Date().toISOString()
    };
    window.localStorage.setItem(
      trialFeedbackStorageKey,
      JSON.stringify(nextFeedback, null, 2)
    );
    setFeedback(nextFeedback);
    setSaved(true);
  }

  function exportFeedback() {
    const data = JSON.stringify(feedback, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "zhike-ai-trial-feedback.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section
      id="trial-feedback"
      className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
            Trial Feedback
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">试讲反馈收集</h2>
        </div>
        <div className="flex gap-2">
          <Button type="button" onClick={saveFeedback} className="bg-cyan-600 hover:bg-cyan-700">
            <Save className="h-4 w-4" />
            {saved ? "已保存" : "保存反馈"}
          </Button>
          <Button type="button" variant="secondary" onClick={exportFeedback}>
            <Download className="h-4 w-4" />
            导出 JSON
          </Button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4 rounded-lg bg-slate-50 p-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">身份</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {feedbackRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => updateFeedback({ role })}
                  className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                    feedback.role === role
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">学科</label>
            <input
              value={feedback.subject}
              onChange={(event) => updateFeedback({ subject: event.target.value })}
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500"
              placeholder="地理"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">评分</label>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => updateFeedback({ rating })}
                  className="rounded-md border border-slate-200 bg-white p-2 transition hover:bg-cyan-50"
                  aria-label={`${rating} 分`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      rating <= feedback.rating
                        ? "fill-cyan-500 text-cyan-500"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4 rounded-lg bg-slate-50 p-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">最有用的部分</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {usefulPartOptions.map((part) => (
                <button
                  key={part}
                  type="button"
                  onClick={() => toggleUsefulPart(part)}
                  className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                    feedback.usefulParts.includes(part)
                      ? "border-cyan-500 bg-cyan-50 text-cyan-800"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {part}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              顾虑
              <textarea
                value={feedback.concerns}
                onChange={(event) => updateFeedback({ concerns: event.target.value })}
                className="mt-2 min-h-28 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-normal leading-6 outline-none focus:border-cyan-500"
                placeholder="比如老师使用成本、内容准确性、课堂适配..."
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              建议
              <textarea
                value={feedback.suggestions}
                onChange={(event) => updateFeedback({ suggestions: event.target.value })}
                className="mt-2 min-h-28 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-normal leading-6 outline-none focus:border-cyan-500"
                placeholder="希望下一版增强哪些试讲体验..."
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
