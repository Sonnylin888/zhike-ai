"use client";

import { LogIn, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("hebei");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const user = login(username, password);
    window.setTimeout(() => {
      setLoading(false);
      if (!user) {
        setMessage("账号或密码错误，或账号已被停用。");
        return;
      }
      router.replace("/");
    }, 180);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 md:px-8">
        <div className="grid w-full gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <section>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
              <ShieldCheck className="h-4 w-4" />
              经销商销售版 / 多账号演示版
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
              智课 AI
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              登录后直接进入课堂演示工作台。Demo 课堂可稳定展示，真实 AI 生成按账号每日次数控制。
            </p>
            <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/8 p-4">课堂 Demo</div>
              <div className="rounded-lg border border-white/10 bg-white/8 p-4">水印归属</div>
              <div className="rounded-lg border border-white/10 bg-white/8 p-4">次数控制</div>
            </div>
          </section>

          <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white p-6 text-slate-950 shadow-2xl">
            <h2 className="text-2xl font-semibold">登录智课 AI</h2>
            <p className="mt-2 text-sm text-slate-500">请输入管理员或经销商演示账号。</p>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">账号</Label>
                <Input id="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="hebei" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="请输入密码" />
              </div>
            </div>
            {message ? (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {message}
              </div>
            ) : null}
            <Button type="submit" disabled={loading} className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700">
              <LogIn className="h-4 w-4" />
              {loading ? "正在登录..." : "进入 Demo Classroom"}
            </Button>
            <p className="mt-4 text-center text-xs text-slate-500">
              默认测试账号由后台统一管理，不在页面底部提供快捷入口。
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
