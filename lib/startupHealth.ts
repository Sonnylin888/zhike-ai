import { detectNetworkStatus } from "@/lib/networkStatus";

export type StartupHealthItem = {
  label: string;
  status: "ready" | "warning" | "error";
  detail: string;
};

async function checkJson(url: string) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}

export async function runStartupHealthCheck(): Promise<StartupHealthItem[]> {
  const demoDataReady = await checkJson("/demo-data/index.json");
  const demoAssetsReady = await checkJson("/demo-assets/manifest.json");
  const storageReady = (() => {
    try {
      window.localStorage.setItem("智课-health-check", "ok");
      window.localStorage.removeItem("智课-health-check");
      return true;
    } catch {
      return false;
    }
  })();
  const network = await detectNetworkStatus();

  return [
    {
      label: "Demo 数据",
      status: demoDataReady ? "ready" : "error",
      detail: demoDataReady ? "可用" : "缺失，需检查 demo-data"
    },
    {
      label: "Demo 资源",
      status: demoAssetsReady ? "ready" : "warning",
      detail: demoAssetsReady ? "可用" : "部分资源缺失，Demo 数据仍可继续"
    },
    {
      label: "本地存储",
      status: storageReady ? "ready" : "error",
      detail: storageReady ? "可用" : "不可用，次数记录可能失败"
    },
    {
      label: "网络",
      status: network.online ? "ready" : "warning",
      detail: network.online ? "在线" : "离线，Demo 可用"
    },
    {
      label: "AI 服务",
      status: network.aiAvailable ? "ready" : "warning",
      detail: network.aiAvailable ? "可用" : "不可用，已保留 Demo 兜底"
    }
  ];
}
