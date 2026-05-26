export type NetworkStatus = {
  online: boolean;
  aiAvailable: boolean;
  mode: "online" | "offline" | "ai-error";
  message: string;
};

export async function detectNetworkStatus(): Promise<NetworkStatus> {
  const browserOnline =
    typeof navigator === "undefined" ? true : navigator.onLine !== false;

  if (!browserOnline) {
    return {
      online: false,
      aiAvailable: false,
      mode: "offline",
      message: "当前网络不可用，已切换至 Demo 演示模式。"
    };
  }

  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    const data = await response.json();

    if (!response.ok || !data.aiConfigured) {
      return {
        online: true,
        aiAvailable: false,
        mode: "ai-error",
        message: "AI 服务暂时不可用，Demo 模式可继续使用。"
      };
    }

    return {
      online: true,
      aiAvailable: true,
      mode: "online",
      message: "在线，AI 服务可用。"
    };
  } catch {
    return {
      online: true,
      aiAvailable: false,
      mode: "ai-error",
      message: "AI 服务异常，已保留 Demo 演示模式。"
    };
  }
}
