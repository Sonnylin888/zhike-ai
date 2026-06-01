"use client";

import {
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Clock3,
  Gauge,
  Hand,
  ImageIcon,
  Layers3,
  Loader2,
  Maximize2,
  Minimize2,
  MessageCircleQuestion,
  MonitorPlay,
  MousePointerClick,
  Presentation,
  RefreshCw,
  Sparkles,
  Timer,
  Wand2
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { AgencyDemoMode } from "@/components/AgencyDemoMode";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DemoHealthCheck } from "@/components/DemoHealthCheck";
import { GeneratedContent } from "@/components/GeneratedContent";
import { HomeworkPlanCard } from "@/components/HomeworkPlanCard";
import { LessonTemplateGallery } from "@/components/LessonTemplateGallery";
import { LessonWorkflowPanel } from "@/components/LessonWorkflowPanel";
import { OfflineDemoNotice } from "@/components/OfflineDemoNotice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaceControlCard } from "@/components/PaceControlCard";
import { ResultCard } from "@/components/ResultCard";
import { SpeakerScriptCard } from "@/components/SpeakerScriptCard";
import { SubjectModuleCard } from "@/components/SubjectModuleCard";
import { TeachingReflectionCard } from "@/components/TeachingReflectionCard";
import { TeachingConsole } from "@/components/TeachingConsole";
import { WorkflowNavigation } from "@/components/WorkflowNavigation";
import { TrialFeedback } from "@/components/TrialFeedback";
import { TrialSummaryPage } from "@/components/TrialSummaryPage";
import { getAgencyDemoPlan } from "@/demoData/agencyDemo";
import { aiFallbackMessage } from "@/lib/aiFallback";
import { normalizeClassroomPackage, type ClassroomPackage } from "@/lib/classroomPackage";
import {
  consumeDailyUsage,
  readAgencySession
} from "@/lib/agencyUsage";
import { logError, logInfo, logWarn } from "@/lib/localLogs";
import {
  getSubjectStyleOptions,
  lessonTemplates,
  type LessonTemplate,
  type TeachingStyle
} from "@/lib/lessonTemplates";
import type { Slide, TeachingPlan } from "@/lib/prompt";

type FormState = {
  grade: string;
  subject: string;
  topic: string;
  textbookVersion: string;
  teachingStyle: TeachingStyle;
};

const defaultForm: FormState = {
  grade: "高中",
  subject: "地理",
  topic: "气候变化",
  textbookVersion: "人教版",
  teachingStyle: "启发式"
};

type PlanListModule = "lessonPlan" | "pptOutline" | "interactionQuestions" | "homework";

const moduleTitles: Record<PlanListModule, string> = {
  lessonPlan: "教案结构",
  pptOutline: "PPT 大纲",
  interactionQuestions: "课堂互动问题",
  homework: "课后练习"
};

type AnimationMode = "fade" | "slide" | "zoom";
type PresentationAudience = "student" | "teacher";
type ResultViewMode = "teacher" | "student";

const animationLabels: Record<AnimationMode, string> = {
  fade: "Fade",
  slide: "Slide",
  zoom: "Zoom"
};

const slideVisuals = [
  {
    keywords: ["warming", "climate", "global", "earth", "气候", "变暖", "地球"],
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    accent: "from-cyan-400/70 via-slate-950/20 to-emerald-300/40",
    label: "Climate signal"
  },
  {
    keywords: ["data", "chart", "curve", "co2", "temperature", "数据", "曲线", "二氧化碳"],
    url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
    accent: "from-sky-300/70 via-slate-950/10 to-amber-200/50",
    label: "Data landscape"
  },
  {
    keywords: ["glacier", "ice", "sea", "water", "冰川", "海平面", "融化"],
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    accent: "from-teal-300/60 via-slate-950/20 to-rose-200/40",
    label: "Cryosphere"
  },
  {
    keywords: ["city", "carbon", "energy", "green", "campus", "低碳", "城市", "校园", "能源"],
    url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
    accent: "from-indigo-300/55 via-slate-950/20 to-lime-200/45",
    label: "Low-carbon future"
  },
  {
    keywords: ["history", "war", "treaty", "timeline", "鸦片", "战争", "条约", "历史"],
    url: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1400&q=80",
    accent: "from-amber-300/55 via-slate-950/20 to-cyan-200/35",
    label: "History timeline"
  },
  {
    keywords: ["math", "fraction", "formula", "diagram", "数学", "分数", "公式", "例题"],
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1400&q=80",
    accent: "from-violet-300/55 via-slate-950/20 to-cyan-200/40",
    label: "Math reasoning"
  },
  {
    keywords: ["english", "grammar", "dialogue", "speaking", "英语", "过去时", "句型", "口语"],
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
    accent: "from-rose-300/50 via-slate-950/20 to-sky-200/40",
    label: "English speaking"
  }
];

function getSlideVisual(prompt: string, index: number) {
  const normalized = prompt.toLowerCase();
  const matched = slideVisuals.find((visual) =>
    visual.keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))
  );

  return matched || slideVisuals[index % slideVisuals.length];
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

function getMinutes(duration: string) {
  const match = duration.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function getPaceSummary(plan: TeachingPlan) {
  const totalMinutes = plan.slides.reduce(
    (sum, slide) => sum + getMinutes(slide.duration),
    0
  );
  const totalInteractions = plan.slides.reduce(
    (sum, slide) => sum + (slide.interactionCount || 0),
    0
  );

  return {
    totalDuration: plan.lessonSummary?.totalDuration || `${totalMinutes || 40}分钟`,
    totalSlides: plan.lessonSummary?.totalSlides || plan.slides.length,
    totalQuestions:
      plan.lessonSummary?.totalQuestions ||
      plan.interactionQuestions.length + plan.slides.length,
    totalInteractions: plan.lessonSummary?.totalInteractions || totalInteractions,
    teachingStyle: plan.lessonSummary?.teachingStyle || "AI 课堂"
  };
}

function planToText(plan: TeachingPlan) {
  const modules = Object.entries(moduleTitles)
    .map(([key, title]) => {
      const items = plan[key as PlanListModule];
      return `${title}\n${items.map((item, index) => `${index + 1}. ${item}`).join("\n")}`;
    })
    .join("\n\n");

  const slides = plan.slides
    .map(
      (slide, index) =>
        `第 ${index + 1} 页：${slide.title}\n核心内容：${slide.content.join("；")}\n节奏：${slide.paceControl.duration}｜讲解 ${slide.paceControl.explainTime}｜互动 ${slide.paceControl.questionTime}\n开场：${slide.speakerScript.opening}\n讲解：${slide.speakerScript.explanation}\n板书：${slide.boardWriting.join("；")}\n课堂提问：${slide.questionGuide.warmUpQuestion}\n追问：${slide.questionGuide.followUpQuestion}\n图片提示词：${slide.imagePrompt}`
    )
    .join("\n\n");

  const workflow = plan.lessonWorkflow
    ? `课堂工作流\n课前：${plan.lessonWorkflow.beforeClass.lessonGoal}\n课中：${plan.lessonWorkflow.inClass.pacePlan}\n课后：${plan.lessonWorkflow.afterClass.summary}`
    : "";

  return `PPT 页面化结果\n${slides}\n\n${workflow}\n\n${modules}`;
}

export function InputForm() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [plan, setPlan] = useState<TeachingPlan | null>(null);
  const [presentationIndex, setPresentationIndex] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const [animationMode, setAnimationMode] = useState<AnimationMode>("slide");
  const [focusMode, setFocusMode] = useState(true);
  const [presentationAudience, setPresentationAudience] =
    useState<PresentationAudience>("teacher");
  const [resultViewMode, setResultViewMode] = useState<ResultViewMode>("teacher");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState("");
  const [usageLimitReached, setUsageLimitReached] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [classroomPackage, setClassroomPackage] = useState<ClassroomPackage | null>(null);
  const [parseMode, setParseMode] = useState("");

  const canCopy = useMemo(() => Boolean(plan), [plan]);
  const paceSummary = useMemo(
    () => (plan ? getPaceSummary(plan) : null),
    [plan]
  );
  const activeTemplateId = useMemo(() => {
    return lessonTemplates.find(
      (template) =>
        template.grade === form.grade &&
        template.subject === form.subject &&
        template.topic === form.topic &&
      template.version === form.textbookVersion
    )?.id;
  }, [form.grade, form.subject, form.topic, form.textbookVersion]);
  const activeTemplate = useMemo(
    () => lessonTemplates.find((template) => template.id === activeTemplateId),
    [activeTemplateId]
  );
  const activeTemplateLabel = activeTemplate
    ? `${activeTemplate.grade}${activeTemplate.subject}｜${activeTemplate.topic}`
    : `${form.grade}${form.subject}｜${form.topic}`;
  const styleOptions = useMemo(
    () => getSubjectStyleOptions(form.subject),
    [form.subject]
  );

  function applyTemplate(template: LessonTemplate) {
    setForm({
      grade: template.grade,
      subject: template.subject,
      topic: template.topic,
      textbookVersion: template.version,
      teachingStyle: template.recommendedStyle
    });
    setPlan(null);
    setPresentationIndex(0);
  }

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
    await generateClassroomPackage(form, true);
  }

  async function generateClassroomPackage(nextForm: FormState, shouldConsumeUsage = true) {
    setLoading(true);
    setError("");
    setCopied(false);
    setUsageLimitReached(false);
    setActionMessage("正在生成课堂包，请稍候。");

    try {
      if (typeof navigator !== "undefined" && navigator.onLine === false) {
        setPlan(getAgencyDemoPlan("climate-change"));
        setClassroomPackage(null);
        setParseMode("");
        setPresentationIndex(0);
        setResultViewMode("teacher");
        setSource("fixed-demo");
        setError("当前网络不可用，可继续使用 Demo 演示模式。");
        await logWarn("AI generation skipped because network is offline");
        return;
      }

      if (shouldConsumeUsage) {
        const session = readAgencySession();
        if (!session) {
          setUsageLimitReached(true);
          throw new Error("请先登录代理商测试账号，再使用 AI 生成。Demo 课堂内容仍可永久免费查看。");
        }

        const consumeResult = consumeDailyUsage(session.userId);
        if (!consumeResult.ok) {
          setUsageLimitReached(true);
          throw new Error("今日 AI 体验次数已用完。Demo 课堂内容仍可继续查看和全屏演示。");
        }
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nextForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "生成失败");
      }

      setPlan(data.plan);
      setClassroomPackage(normalizeClassroomPackage(data));
      setParseMode(data.parseMode || "");
      setPresentationIndex(0);
      setResultViewMode("teacher");
      setSource(data.source || "");
      setActionMessage(
        data.source === "ai"
          ? `已通过 ${data.model || "DeepSeek"} 生成课堂包。`
          : "AI 暂时不可用，已加载可继续演示的 Demo 课堂包。"
      );
      if (data.source === "ai-fallback" || data.source === "demo-fallback") {
        setError(data.message || "当前 AI 服务不可用，已切换至 Demo 模式。");
      }
      await logInfo("AI classroom package generated", {
        source: data.source || "ai"
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "生成失败，请稍后重试。";
      const isUsageOrLoginError =
        message.includes("登录代理商") || message.includes("体验次数");

      if (isUsageOrLoginError) {
        setError(message);
        setActionMessage("AI 生成暂未开始，Demo 课堂仍可直接查看。");
        await logWarn("AI generation blocked", { message });
      } else {
        setPlan(getAgencyDemoPlan("climate-change"));
        setClassroomPackage(null);
        setParseMode("");
        setPresentationIndex(0);
        setResultViewMode("teacher");
        setSource("fixed-demo");
        setError(`${aiFallbackMessage} ${message}`);
        setActionMessage("已自动加载固定 Demo 课堂包。");
        await logError("AI generation failed, fallback demo loaded", { message });
      }
    } finally {
      setLoading(false);
    }
  }

  async function startDemoMode() {
    startFixedDemo("climate-change", false);
  }

  async function startFixedDemo(demoCaseId: string, autoPresent = false) {
    const fixedPlan = getAgencyDemoPlan(demoCaseId);
    const topicMap: Record<string, TeachingStyle> = {
      "climate-change": "探究型",
      "ocean-current": "图像分析型",
      "china-terrain": "案例型",
      earthquake: "互动型"
    };
    const topicTitleMap: Record<string, string> = {
      "climate-change": "气候变化",
      "ocean-current": "洋流",
      "china-terrain": "中国地形",
      earthquake: "地震"
    };

    setForm({
      grade: "高中",
      subject: "地理",
      topic: topicTitleMap[demoCaseId] || "气候变化",
      textbookVersion: "人教版",
      teachingStyle: topicMap[demoCaseId] || "探究型"
    });
    setPlan(fixedPlan);
    setClassroomPackage(null);
    setParseMode("");
    setPresentationIndex(0);
    setResultViewMode("teacher");
    setSource("fixed-demo");
    setError("");
    setUsageLimitReached(false);
    setActionMessage(`已加载「${topicTitleMap[demoCaseId] || "气候变化"}」Demo 课堂包。`);
    await logInfo("Fixed demo classroom loaded", { demoCaseId });

    if (autoPresent) {
      setPresenting(true);
      await document.documentElement.requestFullscreen?.().catch(() => undefined);
    }
  }

  async function copyAll() {
    if (!plan) return;
    try {
      await navigator.clipboard.writeText(planToText(plan));
      setCopied(true);
      setActionMessage("课堂包内容已复制。");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setActionMessage("复制失败，请检查浏览器剪贴板权限。");
    }
  }

  async function startPresentation() {
    if (!plan?.slides.length) return;
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
      <AgencyDemoMode onSelectDemo={startFixedDemo} />
      <OfflineDemoNotice />

      <LessonTemplateGallery
        activeId={activeTemplateId}
        templates={lessonTemplates}
        onSelect={applyTemplate}
      />

      <Card className="overflow-hidden border-cyan-900/10 bg-white/92 shadow-glow backdrop-blur">
        <CardContent className="p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-5">
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
            <div className="space-y-2">
              <Label>教学风格</Label>
              <div className="grid grid-cols-2 gap-2">
                {styleOptions.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        teachingStyle: style
                      }))
                    }
                    className={`rounded-md border px-2.5 py-2 text-left transition ${
                      form.teachingStyle === style
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="block text-xs font-semibold">{style}</span>
                    <span className="mt-0.5 block text-[11px] opacity-70">
                      学科推荐
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              当前风格：{form.teachingStyle}。选择模板后可直接生成一堂可试讲的 AI 课堂。
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={generatePlan}
                disabled={loading}
                className="bg-cyan-600 shadow-[0_14px_35px_rgba(8,145,178,0.28)] hover:bg-cyan-700"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                一键生成课堂包
              </Button>
              <Button
                type="button"
                onClick={startDemoMode}
                disabled={loading}
                className="bg-slate-950 text-white hover:bg-slate-800"
              >
                <MonitorPlay className="h-4 w-4" />
                一键进入 Demo
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
              <p className="font-semibold">{error}</p>
              {usageLimitReached ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href="#cooperation"
                    className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white"
                  >
                    联系合作
                  </a>
                  <a
                    href="#cooperation"
                    className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700"
                  >
                    获取正式授权
                  </a>
                  <a
                    href="#school-trial-mode"
                    className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700"
                  >
                    联系代理支持
                  </a>
                </div>
              ) : null}
            </div>
          ) : null}
          {actionMessage ? (
            <div className="mt-4 rounded-md border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800">
              {actionMessage}
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
                整合课前准备、课中演示、教师讲稿与课后总结...
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
          {source === "ai" && parseMode === "text_fallback" ? (
            <div className="rounded-md border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800">
              AI 已生成内容，当前以文本课堂包形式展示。
            </div>
          ) : null}
          {source === "ai" && classroomPackage ? (
            <GeneratedContent classroomPackage={classroomPackage} />
          ) : null}
          {source === "demo-fallback" || source === "ai-fallback" || source === "fixed-demo" ? (
            <div className="rounded-md border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
              演示模板已就绪：固定 Demo 不扣 AI 次数，支持配图、互动与全屏演示。
            </div>
          ) : null}

          <DemoHealthCheck
            plan={plan}
            source={source}
            activeTemplateLabel={activeTemplateLabel}
          />

          {paceSummary ? (
            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-cyan-900/10 bg-slate-950 p-4 text-white">
                <div className="flex items-center gap-2 text-cyan-100">
                  <Clock3 className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Total Time
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold">
                  {paceSummary.totalDuration}
                </p>
              </div>
              <div className="rounded-lg border border-cyan-900/10 bg-white p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Presentation className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Slides
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  {paceSummary.totalSlides} 页
                </p>
              </div>
              <div className="rounded-lg border border-cyan-900/10 bg-white p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Gauge className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Interactions
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  {paceSummary.totalInteractions} 次互动
                </p>
              </div>
              <div className="rounded-lg border border-cyan-900/10 bg-white p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <MessageCircleQuestion className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Questions
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  {paceSummary.totalQuestions} 个问题
                </p>
              </div>
            </div>
          ) : null}

          {plan.slides[presentationIndex] ? (
            <TeachingConsole
              plan={plan}
              currentSlide={plan.slides[presentationIndex]}
            />
          ) : null}

          {plan.lessonWorkflow && plan.afterClassSummary ? (
            <>
              <WorkflowNavigation />
              <LessonWorkflowPanel
                workflow={plan.lessonWorkflow}
                afterClassSummary={plan.afterClassSummary}
              />
            </>
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
                  {(["teacher", "student"] as ResultViewMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setResultViewMode(mode)}
                      className={`rounded px-3 py-1.5 text-xs font-semibold transition ${
                        resultViewMode === mode
                          ? "bg-cyan-600 text-white"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {mode === "teacher" ? "教师视图" : "学生视图"}
                    </button>
                  ))}
                </div>
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
              {plan.slides.map((slide, index) =>
                resultViewMode === "teacher" ? (
                  <SlideCard
                    key={`${slide.title}-${index}`}
                    slide={slide}
                    index={index}
                    total={plan.slides.length}
                    active={index === presentationIndex}
                    onSelect={() => setPresentationIndex(index)}
                  />
                ) : (
                  <StudentSlideCard
                    key={`${slide.title}-${index}`}
                    slide={slide}
                    index={index}
                    total={plan.slides.length}
                    active={index === presentationIndex}
                    onSelect={() => setPresentationIndex(index)}
                  />
                )
              )}
            </div>
            {resultViewMode === "teacher" && plan.slides[presentationIndex] ? (
              <div className="grid gap-4 xl:grid-cols-[1fr_0.72fr]">
                <div className="space-y-4">
                  <SpeakerScriptCard slide={plan.slides[presentationIndex]} />
                  <SubjectModuleCard slide={plan.slides[presentationIndex]} />
                </div>
                <PaceControlCard slide={plan.slides[presentationIndex]} />
              </div>
            ) : null}
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <ResultCard title="教案结构" items={plan.lessonPlan} />
            <ResultCard title="PPT 大纲" items={plan.pptOutline} />
            <ResultCard title="课堂互动问题" items={plan.interactionQuestions} />
            <ResultCard title="课后练习" items={plan.homework} />
          </div>

          {(plan.homeworkPlan || plan.teachingReflection) ? (
            <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              {plan.homeworkPlan ? (
                <HomeworkPlanCard homeworkPlan={plan.homeworkPlan} />
              ) : null}
              {plan.teachingReflection ? (
                <TeachingReflectionCard reflection={plan.teachingReflection} />
              ) : null}
            </section>
          ) : null}

          <TrialSummaryPage plan={plan} />
          <TrialFeedback />
        </div>
      ) : null}

      {presenting && plan?.slides[presentationIndex] ? (
        <PresentationView
          slide={plan.slides[presentationIndex]}
          index={presentationIndex}
          total={plan.slides.length}
          animationMode={animationMode}
          focusMode={focusMode}
          audience={presentationAudience}
          onToggleFocus={() => setFocusMode((current) => !current)}
          onToggleAudience={() =>
            setPresentationAudience((current) =>
              current === "student" ? "teacher" : "student"
            )
          }
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
  total,
  active,
  onSelect
}: {
  slide: Slide;
  index: number;
  total: number;
  active: boolean;
  onSelect: () => void;
}) {
  const visual = getSlideVisual(slide.imagePrompt, index);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      className={`cursor-pointer overflow-hidden rounded-lg border bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition ${
        active
          ? "border-cyan-400 ring-2 ring-cyan-300/60"
          : "border-cyan-900/10 opacity-80 hover:opacity-100"
      }`}
      onClick={onSelect}
    >
      <div className="grid min-h-full md:grid-cols-[0.92fr_1.08fr]">
        <ImagePromptPanel prompt={slide.imagePrompt} visual={visual} compact />
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-md bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            {active ? (
              <span className="rounded bg-slate-950 px-2 py-1 text-xs font-semibold text-cyan-100">
                当前页
              </span>
            ) : null}
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Timer className="h-3.5 w-3.5" />
              {slide.duration}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Gauge className="h-3.5 w-3.5" />
              {slide.interactionCount} 次
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
            <p className="rounded-md bg-slate-900 px-3 py-2 text-sm leading-6 text-cyan-50">
              节奏：{slide.paceTip}
            </p>
            <p className="text-sm leading-6 text-slate-700">{slide.teacherNote}</p>
            <p className="border-t border-slate-200 pt-3 text-sm font-medium text-slate-900">
              请同学们思考：{slide.question}
            </p>
            <p className="rounded-md bg-cyan-50 px-3 py-2 text-sm leading-6 text-cyan-900">
              AI 讨论提示：{slide.discussionPrompt}
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

function StudentSlideCard({
  slide,
  index,
  total,
  active,
  onSelect
}: {
  slide: Slide;
  index: number;
  total: number;
  active: boolean;
  onSelect: () => void;
}) {
  const visual = getSlideVisual(slide.imagePrompt, index);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      className={`cursor-pointer overflow-hidden rounded-lg border bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition ${
        active ? "border-cyan-400 ring-2 ring-cyan-300/60" : "border-cyan-900/10"
      }`}
      onClick={onSelect}
    >
      <ImagePromptPanel prompt={slide.imagePrompt} visual={visual} compact />
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-md bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="text-xs font-medium text-slate-400">学生视图</span>
        </div>
        <h3 className="text-2xl font-semibold leading-tight text-slate-950">
          {slide.title}
        </h3>
        <ul className="mt-4 space-y-2 text-base leading-7 text-slate-700">
          {slide.content.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-md bg-slate-950 px-4 py-3 text-base font-semibold leading-7 text-cyan-50">
          请同学们思考：{slide.questionGuide.warmUpQuestion}
        </p>
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
        compact ? "min-h-72" : "min-h-[52vh] rounded-lg p-8"
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
      <div className="relative w-fit rounded border border-white/16 bg-white/10 px-2.5 py-1 text-xs font-semibold text-cyan-50 backdrop-blur">
        {visual.label}
      </div>
      <div className="relative">
        <p className={compact ? "text-lg font-semibold leading-7" : "text-3xl font-semibold leading-tight"}>
          {prompt}
        </p>
        <p className="mt-3 text-sm text-cyan-100/80">按 imagePrompt 匹配｜高清课堂投影风格</p>
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
  audience,
  onToggleFocus,
  onToggleAudience,
  onPrev,
  onNext,
  onExit
}: {
  slide: Slide;
  index: number;
  total: number;
  animationMode: AnimationMode;
  focusMode: boolean;
  audience: PresentationAudience;
  onToggleFocus: () => void;
  onToggleAudience: () => void;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
}) {
  const visual = getSlideVisual(slide.imagePrompt, index);
  const animationProps = getAnimationProps(animationMode);
  const showTeacherView = audience === "teacher";

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
          <Button type="button" variant="secondary" onClick={onToggleAudience}>
            <Layers3 className="h-4 w-4" />
            {showTeacherView ? "学生视图" : "教师视图"}
          </Button>
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

      <div
        className={`relative grid flex-1 gap-5 overflow-hidden ${
          showTeacherView && !focusMode
            ? "xl:grid-cols-[1fr_0.82fr_0.42fr]"
            : "lg:grid-cols-[1.1fr_0.9fr]"
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${slide.title}-${index}`}
            {...animationProps}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid min-h-0 gap-6 overflow-hidden lg:grid-cols-[1.05fr_0.95fr] xl:col-span-2"
          >
            <div className="flex min-h-0 flex-col justify-center rounded-lg border border-white/10 bg-white/8 p-7 backdrop-blur">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: 0.08 }}
                className="mb-6 flex flex-wrap items-center gap-3"
              >
                <span className="rounded bg-cyan-300 px-3 py-1 text-sm font-bold text-slate-950">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex items-center gap-2 rounded border border-white/10 bg-white/8 px-3 py-1 text-sm font-semibold text-cyan-100">
                  <Clock3 className="h-4 w-4" />
                  {slide.duration}
                </span>
                <span className="flex items-center gap-2 rounded border border-white/10 bg-white/8 px-3 py-1 text-sm font-semibold text-emerald-100">
                  <Gauge className="h-4 w-4" />
                  互动 {slide.interactionCount} 次
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.46, delay: 0.18 }}
                className="text-5xl font-semibold leading-tight md:text-7xl"
              >
                {slide.title}
              </motion.h2>
              <ul className="mt-9 space-y-5 text-2xl leading-relaxed text-slate-50 md:text-[2rem]">
                {slide.content.map((item, itemIndex) => (
                  <motion.li
                    key={`${slide.title}-present-${itemIndex}`}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.42, delay: 0.34 + itemIndex * 0.14 }}
                    className="flex gap-4"
                  >
                    <span className="mt-4 h-3 w-3 shrink-0 rounded-full bg-cyan-300" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex min-h-0 flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.48, delay: 0.72 }}
                className="min-h-0"
              >
                <ImagePromptPanel prompt={slide.imagePrompt} visual={visual} />
              </motion.div>
              <div className={`grid gap-4 ${showTeacherView ? "md:grid-cols-2" : ""}`}>
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.42, delay: 0.88 }}
                  className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-5"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100">
                    AI 提问
                  </p>
                  <p className="mt-3 text-2xl font-semibold leading-9">
                    请同学们思考：{slide.questionGuide.warmUpQuestion}
                  </p>
                </motion.div>
                {showTeacherView ? (
                <div className="grid gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42, delay: 1.02 }}
                    className="rounded-lg border border-violet-300/20 bg-violet-300/10 p-5"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-100">
                      AI 讨论提示
                    </p>
                    <p className="mt-3 text-lg font-semibold leading-7">
                      {slide.discussionPrompt}
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42, delay: 1.16 }}
                    className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-5"
                  >
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
                  </motion.div>
                </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {showTeacherView && !focusMode ? (
          <aside className="hidden min-h-0 flex-col gap-4 overflow-y-auto rounded-lg border border-white/10 bg-white/8 p-4 backdrop-blur xl:flex">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
                教师视图
              </p>
              <p className="mt-3 text-base leading-7 text-slate-100">
                {slide.speakerScript.opening}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {slide.speakerScript.explanation}
              </p>
            </div>
            <div className="rounded-md border border-white/10 bg-slate-950/40 p-3">
              <p className="text-xs font-semibold text-emerald-100">节奏提示</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                {slide.paceControl.paceWarning}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                讲解 {slide.paceControl.explainTime} · 互动 {slide.paceControl.questionTime} · {slide.paceControl.interactionType}
              </p>
            </div>
            <div className="rounded-md border border-emerald-300/20 bg-emerald-300/10 p-3">
              <p className="text-xs font-semibold text-emerald-100">黑板便签</p>
              <div className="mt-2 space-y-1.5 text-sm leading-6 text-emerald-50">
                {slide.boardWriting.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-white/10 bg-slate-950/40 p-3">
              <p className="text-xs font-semibold text-violet-100">讨论组织</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                {slide.questionGuide.deepQuestion}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                追问：{slide.questionGuide.followUpQuestion}
              </p>
            </div>
            <div className="rounded-md border border-white/10 bg-slate-950/40 p-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-cyan-100">
                <MessageCircleQuestion className="h-3.5 w-3.5" />
                AI 演讲者助手
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-100">
                {slide.speakerAssistant.talkScript}
              </p>
              <div className="mt-3 space-y-2">
                {slide.speakerAssistant.keyPoints.map((point) => (
                  <p key={point} className="text-xs leading-5 text-cyan-50">
                    · {point}
                  </p>
                ))}
              </div>
              <div className="mt-3 border-t border-white/10 pt-3">
                {slide.speakerAssistant.studentQuestions.map((question, questionIndex) => (
                  <div key={question} className="mb-2 last:mb-0">
                    <p className="text-xs font-semibold text-amber-100">学生可能问</p>
                    <p className="mt-1 text-xs leading-5 text-slate-200">{question}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {slide.speakerAssistant.teacherAnswers[questionIndex] ||
                        "回到材料证据，引导学生自己说出判断。"}
                    </p>
                  </div>
                ))}
              </div>
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
