export type AgencyRole = "Demo" | "Teacher" | "Admin";

export type AgencySession = {
  userId: string;
  role: AgencyRole;
  loginAt: string;
};

export type DailyUsage = {
  userId: string;
  dailyLimit: number;
  usedToday: number;
  remainingToday: number;
  lastResetDate: string;
};

export const agencyAccounts = [
  { userId: "demo01", password: "123456", role: "Demo" as const },
  { userId: "demo02", password: "123456", role: "Demo" as const },
  { userId: "demo03", password: "123456", role: "Demo" as const },
  { userId: "demo04", password: "123456", role: "Demo" as const },
  { userId: "demo05", password: "123456", role: "Demo" as const },
  { userId: "demo06", password: "123456", role: "Demo" as const }
];

export const dailyAiLimit = 20;
export const agencySessionStorageKey = "智课 AI-agency-session";
export const agencyUsageStorageKey = "智课 AI-daily-usage";
export const agencyUsageChangedEvent = "agency-usage-changed";

export function getTodayDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createDailyUsage(userId: string, dateKey = getTodayDateKey()): DailyUsage {
  return {
    userId,
    dailyLimit: dailyAiLimit,
    usedToday: 0,
    remainingToday: dailyAiLimit,
    lastResetDate: dateKey
  };
}

export function validateAgencyLogin(userId: string, password: string) {
  return agencyAccounts.find(
    (account) => account.userId === userId.trim() && account.password === password
  );
}

export function readAgencySession(): AgencySession | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(agencySessionStorageKey);
  return stored ? (JSON.parse(stored) as AgencySession) : null;
}

export function writeAgencySession(session: AgencySession) {
  window.localStorage.setItem(agencySessionStorageKey, JSON.stringify(session));
  window.dispatchEvent(new Event(agencyUsageChangedEvent));
}

export function clearAgencySession() {
  window.localStorage.removeItem(agencySessionStorageKey);
  window.dispatchEvent(new Event(agencyUsageChangedEvent));
}

function readUsageMap(): Record<string, DailyUsage> {
  if (typeof window === "undefined") return {};
  const stored = window.localStorage.getItem(agencyUsageStorageKey);
  return stored ? (JSON.parse(stored) as Record<string, DailyUsage>) : {};
}

function writeUsageMap(usageMap: Record<string, DailyUsage>) {
  window.localStorage.setItem(agencyUsageStorageKey, JSON.stringify(usageMap));
  window.dispatchEvent(new Event(agencyUsageChangedEvent));
}

export function readDailyUsage(userId: string): DailyUsage {
  const usageMap = readUsageMap();
  const dateKey = getTodayDateKey();
  const current = usageMap[userId];

  if (!current || current.lastResetDate !== dateKey) {
    const resetUsage = createDailyUsage(userId, dateKey);
    writeUsageMap({ ...usageMap, [userId]: resetUsage });
    return resetUsage;
  }

  return {
    ...current,
    remainingToday: Math.max(0, current.dailyLimit - current.usedToday)
  };
}

export function consumeDailyUsage(userId: string) {
  const usage = readDailyUsage(userId);

  if (usage.remainingToday <= 0) {
    return {
      ok: false,
      usage
    };
  }

  const nextUsage: DailyUsage = {
    ...usage,
    usedToday: usage.usedToday + 1,
    remainingToday: Math.max(0, usage.dailyLimit - usage.usedToday - 1)
  };
  writeUsageMap({ ...readUsageMap(), [userId]: nextUsage });

  return {
    ok: true,
    usage: nextUsage
  };
}
