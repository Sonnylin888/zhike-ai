"use client";

import { Loader2, RefreshCw, Sparkles, Clipboard } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResultCard } from "@/components/ResultCard";
import type { TeachingPlan } from "@/lib/prompt";

type FormState = {
  grade: string;
  subject: string;
  topic: string;
  textbookVersion: string;
};

const defaultForm: FormState = {
  grade: "高中",
  subject: "地理",
  topic: "气候变化",
  textbookVersion: "人教版"
};

const moduleTitles: Record<keyof TeachingPlan, string> = {
  lessonPlan: "教案结构",
  pptOutline: "PPT 大纲",
  interactionQuestions: "课堂互动问题",
  homework: "课后练习"
};

function planToText(plan: TeachingPlan) {
  return Object.entries(moduleTitles)
    .map(([key, title]) => {
      const items = plan[key as keyof TeachingPlan];
      return `${title}\n${items.map((item, index) => `${index + 1}. ${item}`).join("\n")}`;
    })
    .join("\n\n");
}

export function InputForm() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [plan, setPlan] = useState<TeachingPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState("");

  const canCopy = useMemo(() => Boolean(plan), [plan]);

  async function generatePlan() {
    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "生成失败");
      }

      setPlan(data.plan);
      setSource(data.source || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  async function copyAll() {
    if (!plan) return;
    await navigator.clipboard.writeText(planToText(plan));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-6">
      <Card className="border-teal-900/10 bg-white/90 shadow-glow backdrop-blur">
        <CardContent className="p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="grade">学段/年级</Label>
              <Input
                id="grade"
                value={form.grade}
                onChange={(event) =>
                  setForm((current) => ({ ...current, grade: event.target.value }))
                }
                placeholder="高中"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">学科</Label>
              <Input
                id="subject"
                value={form.subject}
                onChange={(event) =>
                  setForm((current) => ({ ...current, subject: event.target.value }))
                }
                placeholder="地理"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">课题</Label>
              <Input
                id="topic"
                value={form.topic}
                onChange={(event) =>
                  setForm((current) => ({ ...current, topic: event.target.value }))
                }
                placeholder="气候变化"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="textbookVersion">教材版本</Label>
              <Input
                id="textbookVersion"
                value={form.textbookVersion}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    textbookVersion: event.target.value
                  }))
                }
                placeholder="人教版"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              默认演示：高中地理｜人教版｜气候变化
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={generatePlan} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                生成教学方案
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={generatePlan}
                disabled={loading || !plan}
              >
                <RefreshCw className="h-4 w-4" />
                重新生成
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={copyAll}
                disabled={!canCopy}
              >
                <Clipboard className="h-4 w-4" />
                {copied ? "已复制" : "复制全部"}
              </Button>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Object.values(moduleTitles).map((title) => (
            <Card key={title} className="border-teal-900/10 bg-white/70">
              <CardContent className="p-5">
                <div className="mb-4 h-5 w-28 rounded bg-teal-100" />
                <div className="space-y-3">
                  <div className="h-4 rounded bg-slate-100" />
                  <div className="h-4 rounded bg-slate-100" />
                  <div className="h-4 w-3/4 rounded bg-slate-100" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {plan && !loading ? (
        <div className="space-y-3">
          {source === "demo-fallback" ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              当前未配置 API Key，正在使用内置 Demo 结果。配置后会调用 AI 实时生成。
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <ResultCard title="教案结构" items={plan.lessonPlan} />
            <ResultCard title="PPT 大纲" items={plan.pptOutline} />
            <ResultCard title="课堂互动问题" items={plan.interactionQuestions} />
            <ResultCard title="课后练习" items={plan.homework} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
