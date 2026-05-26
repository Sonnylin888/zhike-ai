type LogLevel = "info" | "warn" | "error";

declare global {
  interface Window {
    zhiKeDesktop?: {
      log: (level: LogLevel, message: string, meta?: Record<string, unknown>) => Promise<void>;
      getLogPath: () => Promise<string>;
    };
  }
}

const browserLogKey = "智课-local-logs";

function sanitizeMeta(meta?: Record<string, unknown>) {
  if (!meta) return undefined;
  const blockedKeys = ["apiKey", "authorization", "token", "password"];

  return Object.fromEntries(
    Object.entries(meta).map(([key, value]) => [
      key,
      blockedKeys.some((blockedKey) => key.toLowerCase().includes(blockedKey))
        ? "[hidden]"
        : value
    ])
  );
}

export async function writeLocalLog(
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>
) {
  const payload = {
    time: new Date().toISOString(),
    level,
    message,
    meta: sanitizeMeta(meta)
  };

  if (typeof window !== "undefined") {
    await window.zhiKeDesktop?.log(level, message, payload.meta).catch(() => undefined);
    const stored = window.localStorage.getItem(browserLogKey);
    const logs = stored ? (JSON.parse(stored) as typeof payload[]) : [];
    window.localStorage.setItem(browserLogKey, JSON.stringify([...logs.slice(-99), payload]));
  }
}

export function logInfo(message: string, meta?: Record<string, unknown>) {
  return writeLocalLog("info", message, meta);
}

export function logWarn(message: string, meta?: Record<string, unknown>) {
  return writeLocalLog("warn", message, meta);
}

export function logError(message: string, meta?: Record<string, unknown>) {
  return writeLocalLog("error", message, meta);
}
