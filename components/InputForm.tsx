"use client";

import {
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Clock3,
  Hand,
  ImageIcon,
  Loader2,
  Maximize2,
  Minimize2,
  MonitorPlay,
  MousePointerClick,
  RefreshCw,
  Sparkles,
  Timer,
  Wand2
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResultCard } from "@/components/ResultCard";
import type { Slide, TeachingPlan } from "@/lib/prompt";

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

const moduleTitles: Record<Exclude<keyof TeachingPlan, "slides">, string> = {
  lessonPlan: "教案结构",
  pptOutline: "PPT 大纲",
  interactionQuestions: "课堂互动问题",
  homework: "课后练习"
};

type AnimationMode = "fade" | "slide" | "zoom";

const animationLabels: Record<AnimationMode, string> = {
  fade: "Fade",
  slide: "Slide",
  zoom: "Zoom"
};

const slideVisuals = [
  {
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    accent: "from-cyan-400/70 via-slate-950/20 to-emerald-300/40"
  },
  {
    url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
    accent: "from-sky-300/70 via-slate-950/10 to-amber-200/50"
  },
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    accent: "from-teal-300/60 via-slate-950/20 to-rose-200/40"
  },
  {
    url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
    accent: "from-indigo-300/55 via-slate-950/20 to-lime-200/45"
  }
];

function getSlideVisual(index: number) {
  return slideVisuals[index % slideVisuals.length];
}

function getQuizLabel(type: Slide["quiz"]["type"]) {
  if (type === "single") return "选择题";
  if (type === "trueFalse") return "判断题";
  return "举手互动";
}

function getAnimationProps(mode: AnimationMode) {
  if (mode === "slide") {
    return {
      initial: { opacity: 0, x: 90 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -90 }
    };
  }
  if (mode === "zoom") {
    return {
      initial: { opacity: 0, scale: 0.94 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.04 }
    };
  }
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };
}

function planToText(plan: TeachingPlan) {
  const modules = Object.entries(moduleTitles)
    .map(([key, title]) => {
      const items = plan[key as keyof TeachingPlan];
      return `${title}\n${items.map((item, index) => `${index + 1}. ${item}`).join("\n")}`;
    })
    .join("\n\n");

  const slides = plan.slides
    .map(
      (slide, index) =>
        `第 ${index + 1} 页：${slide.title}\n核心内容：${slide.content.join("；")}\n节奏：${slide.duration}｜${slide.teacherTip}\n教师提示：${slide.teacherNote}\n课堂提问：${slide.question}\n小测：${slide.quiz.question}（${slide.quiz.answer}）\n图片提示词：${slide.imagePrompt}`
    )
    .join("\n\n");

  return `PPT 页面化结果\n${slides}\n\n${modules}`;
}

export function InputForm() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [plan, setPlan] = useState<TeachingPlan | null>(null);
  const [presentationIndex, setPresentationIndex] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const [animationMode, setAnimationMode] = useState<AnimationMode>("slide");
  const [focusMode, setFocusMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState("");

  const canCopy = useMemo(() => Boolean(plan), [plan]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!presenting) return;
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goToSlide("prev");
      }
      if (
        event.key === "ArrowRight" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        goToSlide("next");
      }
      if (event.key === "Escape") {
        event.preventDefault();
        stopPresentation();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [presenting, plan?.slides.length]);

  useEffect(() => {
    function handleFullscreenChange() {
      if (!document.fullscreenElement) {
        setPresenting(false);
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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
      setPresentationIndex(0);
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

  async function startPresentation() {
    if (!plan?.slides.length) return;
    setPresentationIndex(0);
    setPresenting(true);
    await document.documentElement.requestFullscreen?.().catch(() => undefined);
  }

  async function stopPresentation() {
    setPresenting(false);
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined);
    }
  }

  function goToSlide(direction: "prev" | "next") {
    if (!plan?.slides.length) return;
    setPresentationIndex((current) => {
      if (direction === "prev") {
        return Math.max(0, current - 1);
      }
      return Math.min(plan.slides.length - 1, current + 1);
    });
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-cyan-900/10 bg-white/92 shadow-glow backdrop-blur">
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
              默认演示：高中地理｜人教版｜气候变化，生成后可直接进入大屏试讲。
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={generatePlan}
                disabled={loading}
                className="bg-cyan-600 shadow-[0_14px_35px_rgba(8,145,178,0.28)] hover:bg-cyan-700"
              >
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
        <div className="rounded-lg border border-cyan-900/10 bg-slate-950 p-5 text-white shadow-glow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/15">
              <Loader2 className="h-5 w-5 animate-spin text-cyan-200" />
            </div>
            <div>
              <p className="font-semibold">AI 正在编排课堂演示页</p>
              <p className="text-sm text-cyan-100/75">
                拆分 PPT 页面、生成教师提示与课堂提问...
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="min-h-48 rounded-lg border border-white/10 bg-white/8 p-4"
              >
                <div className="mb-4 h-28 rounded-md bg-cyan-300/10" />
                <div className="space-y-3">
                  <div className="h-4 rounded bg-white/16" />
                  <div className="h-4 rounded bg-white/12" />
                  <div className="h-4 w-2/3 rounded bg-white/12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {plan && !loading ? (
        <div className="space-y-5">
          {source === "demo-fallback" || source === "ai-fallback" ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              当前 AI 生成不可用，正在使用内置 Demo 结果，演示流程可继续。
            </div>
          ) : null}

          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                  AI Slide Deck
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  PPT 页面化结果
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex rounded-md border border-slate-200 bg-white p-1 shadow-sm">
                  {(Object.keys(animationLabels) as AnimationMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setAnimationMode(mode)}
                      className={`rounded px-3 py-1.5 text-xs font-semibold transition ${
                        animationMode === mode
                          ? "bg-slate-950 text-white"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {animationLabels[mode]}
                    </button>
                  ))}
                </div>
                <Button
                  type="button"
                  onClick={startPresentation}
                  disabled={!plan.slides.length}
                  className="bg-slate-950 text-white shadow-[0_16px_35px_rgba(15,23,42,0.24)] hover:bg-slate-800"
                >
                  <MonitorPlay className="h-4 w-4" />
                  开始演示
                </Button>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {plan.slides.map((slide, index) => (
                <SlideCard
                  key={`${slide.title}-${index}`}
                  slide={slide}
                  index={index}
                  total={plan.slides.length}
                />
              ))}
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <ResultCard title="教案结构" items={plan.lessonPlan} />
            <ResultCard title="PPT 大纲" items={plan.pptOutline} />
            <ResultCard title="课堂互动问题" items={plan.interactionQuestions} />
            <ResultCard title="课后练习" items={plan.homework} />
          </div>
        </div>
      ) : null}

      {presenting && plan?.slides[presentationIndex] ? (
        <PresentationView
          slide={plan.slides[presentationIndex]}
          index={presentationIndex}
          total={plan.slides.length}
          animationMode={animationMode}
          focusMode={focusMode}
          onToggleFocus={() => setFocusMode((current) => !current)}
          onPrev={() => goToSlide("prev")}
          onNext={() => goToSlide("next")}
          onExit={stopPresentation}
        />
      ) : null}
    </div>
  );
}

function SlideCard({
  slide,
  index,
  total
}: {
  slide: Slide;
  index: number;
  total: number;
}) {
  const visual = getSlideVisual(index);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      className="overflow-hidden rounded-lg border border-cyan-900/10 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
    >
      <div className="grid min-h-full md:grid-cols-[0.92fr_1.08fr]">
        <ImagePromptPanel prompt={slide.imagePrompt} visual={visual} compact />
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-md bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Timer className="h-3.5 w-3.5" />
              {slide.duration}
            </span>
          </div>
          <h3 className="text-xl font-semibold leading-tight text-slate-950">
            {slide.title}
          </h3>
          <ul className="space-y-2 text-sm leading-6 text-slate-700">
            {slide.content.map((item, itemIndex) => (
              <li key={`${slide.title}-${itemIndex}`} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto space-y-3 rounded-md bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">教师讲解提示</span>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                {slide.teacherTip}
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-700">{slide.teacherNote}</p>
            <p className="border-t border-slate-200 pt-3 text-sm font-medium text-slate-900">
              请同学们思考：{slide.question}
            </p>
            <div className="rounded-md border border-cyan-100 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-700">
                  AI 小测验 · {getQuizLabel(slide.quiz.type)}
                </span>
                <MousePointerClick className="h-3.5 w-3.5 text-cyan-600" />
              </div>
              <p className="text-sm font-medium text-slate-900">{slide.quiz.question}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {slide.quiz.options.map((option) => (
                  <span
                    key={option}
                    className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600"
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ImagePromptPanel({
  prompt,
  visual,
  compact = false
}: {
  prompt: string;
  visual: (typeof slideVisuals)[number];
  compact?: boolean;
}) {
  return (
    <div
      className={`relative flex min-h-56 flex-col justify-between overflow-hidden bg-slate-950 p-5 text-white ${
        compact ? "" : "min-h-[42vh] rounded-lg p-8"
      }`}
    >
      <img
        src={visual.url}
        alt={prompt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className={`absolute inset-0 bg-gradient-to-br ${visual.accent}`} />
      <div className="absolute inset-0 bg-slate-950/35" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] bg-[size:30px_30px]" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-100">
          <ImageIcon className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">
            AI Visual
          </span>
        </div>
        <Wand2 className="h-4 w-4 text-cyan-100/80" />
      </div>
      <div className="relative">
        <p className={compact ? "text-lg font-semibold leading-7" : "text-3xl font-semibold leading-tight"}>
          {prompt}
        </p>
        <p className="mt-3 text-sm text-cyan-100/80">Unsplash mock 图｜高清课堂投影风格</p>
      </div>
    </div>
  );
}

function PresentationView({
  slide,
  index,
  total,
  animationMode,
  focusMode,
  onToggleFocus,
  onPrev,
  onNext,
  onExit
}: {
  slide: Slide;
  index: number;
  total: number;
  animationMode: AnimationMode;
  focusMode: boolean;
  onToggleFocus: () => void;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
}) {
  const visual = getSlideVisual(index);
  const animationProps = getAnimationProps(animationMode);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-slate-950 p-5 text-white md:p-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="relative mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
            AI Teaching Demo
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {index + 1} / {total} · {animationLabels[animationMode]} · ← → 翻页 · ESC 退出
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={onToggleFocus}>
            <Maximize2 className="h-4 w-4" />
            {focusMode ? "显示备注" : "聚焦模式"}
          </Button>
          <Button type="button" variant="secondary" onClick={onExit}>
            <Minimize2 className="h-4 w-4" />
            退出演示
          </Button>
        </div>
      </div>

      <div className={`relative grid flex-1 gap-5 overflow-hidden ${focusMode ? "lg:grid-cols-[1.1fr_0.9fr]" : "xl:grid-cols-[1fr_0.82fr_0.42fr]"}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${slide.title}-${index}`}
            {...animationProps}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="grid min-h-0 gap-6 overflow-hidden lg:grid-cols-[1.05fr_0.95fr] xl:col-span-2"
          >
            <div className="flex min-h-0 flex-col justify-center rounded-lg border border-white/10 bg-white/8 p-7 backdrop-blur">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="rounded bg-cyan-300 px-3 py-1 text-sm font-bold text-slate-950">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex items-center gap-2 rounded border border-white/10 bg-white/8 px-3 py-1 text-sm font-semibold text-cyan-100">
                  <Clock3 className="h-4 w-4" />
                  {slide.duration}
                </span>
              </div>
              <h2 className="text-5xl font-semibold leading-tight md:text-7xl">
                {slide.title}
              </h2>
              <ul className="mt-9 space-y-5 text-2xl leading-relaxed text-slate-50 md:text-[2rem]">
                {slide.content.map((item, itemIndex) => (
                  <li key={`${slide.title}-present-${itemIndex}`} className="flex gap-4">
                    <span className="mt-4 h-3 w-3 shrink-0 rounded-full bg-cyan-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex min-h-0 flex-col gap-4">
              <ImagePromptPanel prompt={slide.imagePrompt} visual={visual} />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100">
                    AI 提问
                  </p>
                  <p className="mt-3 text-2xl font-semibold leading-9">
                    请同学们思考：{slide.question}
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
                    <Hand className="h-4 w-4" />
                    {getQuizLabel(slide.quiz.type)}
                  </p>
                  <p className="mt-3 text-xl font-semibold leading-8">{slide.quiz.question}</p>
                  <div className="mt-4 grid gap-2">
                    {slide.quiz.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className="rounded-md border border-white/12 bg-white/8 px-3 py-2 text-left text-base font-medium text-slate-100 transition hover:border-cyan-200/50 hover:bg-white/14"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {!focusMode ? (
          <aside className="hidden min-h-0 flex-col gap-4 overflow-hidden rounded-lg border border-white/10 bg-white/8 p-4 backdrop-blur xl:flex">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
                演讲者备注
              </p>
              <p className="mt-3 text-base leading-7 text-slate-200">{slide.teacherNote}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-slate-950/40 p-3">
              <p className="text-xs font-semibold text-emerald-100">节奏提示</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">{slide.teacherTip}</p>
            </div>
            <div className="mt-auto grid grid-cols-4 gap-2">
              {Array.from({ length: total }).map((_, itemIndex) => (
                <button
                  key={itemIndex}
                  type="button"
                  className={`h-2 rounded-full transition ${
                    itemIndex === index ? "bg-cyan-300" : "bg-white/18"
                  }`}
                  aria-label={`第 ${itemIndex + 1} 页`}
                />
              ))}
            </div>
          </aside>
        ) : null}
      </div>

      <div className="relative mt-5 flex items-center justify-between">
        <Button type="button" variant="secondary" onClick={onPrev} disabled={index === 0}>
          <ChevronLeft className="h-4 w-4" />
          上一页
        </Button>
        <div className="flex items-center gap-2">
          {Array.from({ length: total }).map((_, itemIndex) => (
            <div
              key={itemIndex}
              className={`h-2.5 rounded-full transition-all ${
                itemIndex === index ? "w-12 bg-cyan-300" : "w-5 bg-white/18"
              }`}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={onNext}
          disabled={index === total - 1}
        >
          下一页
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
