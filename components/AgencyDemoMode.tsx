"use client";

import { LockKeyhole, LogOut, MonitorPlay, Sparkles, UserRoundCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { agencyDemoCases } from "@/demoData/agencyDemo";
import {
  agencyUsageChangedEvent,
  clearAgencySession,
  readAgencySession,
  readDailyUsage,
  validateAgencyLogin,
  writeAgencySession,
  type AgencySession,
  type DailyUsage
} from "@/lib/agencyUsage";

type Props = {
  onSelectDemo?: (demoCaseId: string, autoPresent?: boolean) => void;
};

export function AgencyDemoMode({ onSelectDemo }: Props) {
  const [session, setSession] = useState<AgencySession | null>(null);
  const [usage, setUsage] = useState<DailyUsage | null>(null);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState(agencyDemoCases[0].id);

  const selectedCase = useMemo(
    () => agencyDemoCases.find((item) => item.id === selectedCaseId) || agencyDemoCases[0],
    [selectedCaseId]
  );

  useEffect(() => {
    function refresh() {
      const nextSession = readAgencySession();
      setSession(nextSession);
      setUsage(nextSession ? readDailyUsage(nextSession.userId) : null);
    }

    refresh();
    window.addEventListener(agencyUsageChangedEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(agencyUsageChangedEvent, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  function login() {
    const account = validateAgencyLogin(userId, password);
    if (!account) {
      setLoginError("账号或密码不正确，请联系项目负责人获取代理商测试账号。");
      return;
    }

    const nextSession: AgencySession = {
      userId: account.userId,
      role: account.role,
      loginAt: new Date().toISOString()
    };
    if (!writeAgencySession(nextSession)) {
      setLoginError("浏览器无法保存登录状态，请检查隐私模式或站点存储权限。");
      return;
    }
    readDailyUsage(nextSession.userId);
    setPassword("");
    setLoginError("");
    setActionMessage(`已登录 ${nextSession.userId}，Demo Classroom 已就绪。`);
    window.setTimeout(() => {
      document.getElementById("demo-classroom")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  function logout() {
    clearAgencySession();
    setActionMessage("已退出代理商测试账号。");
  }

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

            {session && usage ? (
              <div className="mt-5 rounded-lg bg-slate-950 p-4 text-white">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-cyan-200">
                      已登录：{session.userId}
                    </p>
                    <p className="mt-1 text-2xl font-semibold">
                      今日 AI 剩余次数：{usage.remainingToday} / {usage.dailyLimit}
                    </p>
                  </div>
                  <Button type="button" variant="secondary" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                    退出
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-lg bg-slate-50 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">
                    代理商账号
                    <input
                      value={userId}
                      onChange={(event) => setUserId(event.target.value)}
                      className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500"
                      placeholder="请输入账号"
                      autoComplete="username"
                    />
                  </label>
                  <label className="text-sm font-semibold text-slate-700">
                    密码
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500"
                      placeholder="请输入密码"
                      autoComplete="current-password"
                    />
                  </label>
                </div>
                <Button type="button" onClick={login} className="mt-4 bg-slate-950 text-white hover:bg-slate-800">
                  <LockKeyhole className="h-4 w-4" />
                  登录并进入 Demo Classroom
                </Button>
                {loginError ? (
                  <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {loginError}
                  </p>
                ) : null}
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
