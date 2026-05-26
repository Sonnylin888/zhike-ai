import { Loader2 } from "lucide-react";

export function LoadingFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="rounded-lg border border-white/10 bg-white/8 p-6 text-center shadow-glow">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-200" />
        <h1 className="mt-4 text-2xl font-semibold">智课正在加载 Demo Classroom</h1>
        <p className="mt-2 text-sm text-slate-300">如 AI 服务暂时不可用，将自动切换至 Demo 模式。</p>
      </div>
    </main>
  );
}
