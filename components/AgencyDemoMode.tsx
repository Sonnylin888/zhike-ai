"use client";

import { MonitorPlay, Sparkles, UserRoundCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { agencyDemoCases } from "@/demoData/agencyDemo";
import { getCurrentUser, type ZhikeUser } from "@/lib/auth";
import { getRemainingUsage, getUsageForUser } from "@/lib/usageLimiter";

type Props = {
  onSelectDemo?: (demoCaseId: string, autoPresent?: boolean) => void;
};

export function AgencyDemoMode({ onSelectDemo }: Props) {
  const [user, setUser] = useState<ZhikeUser | null>(null);
  const [actionMessage, setActionMessage] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState(agencyDemoCases[0].id);

  const selectedCase = useMemo(
    () => agencyDemoCases.find((item) => item.id === selectedCaseId) || agencyDemoCases[0],
    [selectedCaseId]
  );

  useEffect(() => {
    function refresh() {
      setUser(getCurrentUser());
    }

    refresh();
    window.addEventListener("zhike-auth-changed", refresh);
    window.addEventListener("zhike-usage-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("zhike-auth-changed", refresh);
      window.removeEventListener("zhike-usage-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  function startDemo(autoPresent = false) {
    onSelectDemo?.(selectedCase.id, autoPresent);
    setActionMessage(
      autoPresent
        ? `正在打开「${selectedCase.title}」全屏课堂演示。`
        : `已加载「${selectedCase.title}」Demo 课堂包。`
    );
    window.setTimeout(() => {
      document.getElementById("classroom-workbench")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  return (
    <section
      id="agency-demo-mode"
      className="mx-auto flex max-w-6xl scroll-mt-8 flex-col gap-5 px-4 py-8 md:px-8"
    >
      <div className="overflow-hidden rounded-lg border border-cyan-900/10 bg-white/92 p-5 shadow-glow backdrop-blur">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-md bg-cyan-50 px-3 py-1.5 text-sm font-semibold text-cyan-800">
              <UserRoundCheck className="h-4 w-4" />
              Agency Demo Account
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-slate-950 md:text-4xl">
              代理商试用入口
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Demo 课堂内容永久免费查看；真实 AI 教学生成每日 20 次，用于控制高频调用，同时保留完整课堂体验。
            </p>

            {user ? (
              <div className="mt-5 rounded-lg bg-slate-950 p-4 text-white">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-cyan-200">
                      当前账号：{user.displayName}
                    </p>
                    <p className="mt-1 text-2xl font-semibold">
                      今日 AI 剩余次数：{getRemainingUsage(user)} / {getUsageForUser(user).limit}
                    </p>
                    <p className="mt-1 text-sm text-cyan-50/70">水印：{user.watermark}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                正在读取当前登录账号...
              </div>
            )}
          </div>

          <div id="demo-classroom" className="rounded-lg bg-slate-950 p-5 text-white">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  Demo Classroom
                </p>
                <h3 className="mt-1 text-2xl font-semibold">固定最佳演示内容</h3>
              </div>
              <Sparkles className="h-5 w-5 text-cyan-200" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {agencyDemoCases.map((demoCase) => (
                <button
                  key={demoCase.id}
                  type="button"
                  onClick={() => setSelectedCaseId(demoCase.id)}
                  className={`rounded-lg border p-4 text-left transition ${
                    selectedCaseId === demoCase.id
                      ? "border-cyan-300 bg-cyan-300/16"
                      : "border-white/10 bg-white/8 hover:border-cyan-200/50 hover:bg-white/12"
                  }`}
                >
                  <p className="font-semibold text-cyan-50">{demoCase.title}</p>
                  <p className="mt-2 text-sm leading-6 text-cyan-50/72">
                    {demoCase.description}
                  </p>
                  <p className="mt-3 rounded bg-white/8 px-2 py-1 text-xs text-cyan-100">
                    {demoCase.highlight}
                  </p>
                </button>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={() => startDemo(true)}
                className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
              >
                <MonitorPlay className="h-4 w-4" />
                开始 AI 课堂演示
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => startDemo(false)}
                className="border-white/15 bg-white/10 text-white hover:bg-white/16"
              >
                查看 Demo 课堂包
              </Button>
            </div>
            <p className="mt-4 text-sm leading-6 text-cyan-50/72">
              当前选择：{selectedCase.title}。固定 Demo 不扣 AI 次数，适合代理商快速看效果。
            </p>
            {actionMessage ? (
              <p className="mt-3 rounded-md border border-cyan-200/20 bg-cyan-200/10 px-3 py-2 text-sm font-semibold text-cyan-50">
                {actionMessage}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
