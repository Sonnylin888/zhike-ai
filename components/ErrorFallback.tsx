"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { logError } from "@/lib/localLogs";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorFallback extends Component<Props, State> {
  state: State = {
    hasError: false
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError("React page error", {
      message: error.message,
      componentStack: errorInfo.componentStack || ""
    });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="max-w-xl rounded-lg border border-white/10 bg-white/8 p-6 shadow-glow">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Error Boundary
          </p>
          <h1 className="mt-3 text-3xl font-semibold">页面加载异常，请返回 Demo Classroom。</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            智课已记录本地错误日志。Demo 数据仍可作为离线演示兜底使用。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
              <a href="/#agency-demo-mode">返回 Demo Classroom</a>
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.location.reload()}>
              重新加载
            </Button>
            <Button asChild variant="secondary">
              <a href="#delivery-guide">查看日志位置</a>
            </Button>
          </div>
        </div>
      </main>
    );
  }
}
