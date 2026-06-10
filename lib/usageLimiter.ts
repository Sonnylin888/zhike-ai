"use client";

import type { ZhikeUser } from "@/lib/auth";

export type UsageRecord = {
  userId: string;
  date: string;
  used: number;
  limit: number;
};

export const usageRecordsStorageKey = "zhike_usage_records";

export function getTodayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getUsageRecords(): UsageRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(usageRecordsStorageKey);
    return stored ? JSON.parse(stored) as UsageRecord[] : [];
  } catch {
    return [];
  }
}

export function saveUsageRecords(records: UsageRecord[]) {
  window.localStorage.setItem(usageRecordsStorageKey, JSON.stringify(records));
  window.dispatchEvent(new Event("zhike-usage-changed"));
}

export function getUsageForUser(user: ZhikeUser): UsageRecord {
  const date = getTodayKey();
  return getUsageRecords().find((record) => record.userId === user.id && record.date === date) || {
    userId: user.id,
    date,
    used: 0,
    limit: user.dailyLimit
  };
}

export function consumeUsage(user: ZhikeUser) {
  const records = getUsageRecords();
  const current = getUsageForUser(user);
  if (current.used >= current.limit) {
    return { ok: false, record: current };
  }
  const nextRecord = { ...current, used: current.used + 1, limit: user.dailyLimit };
  saveUsageRecords([
    ...records.filter((record) => !(record.userId === user.id && record.date === current.date)),
    nextRecord
  ]);
  return { ok: true, record: nextRecord };
}

export function getRemainingUsage(user: ZhikeUser) {
  const usage = getUsageForUser(user);
  return Math.max(0, usage.limit - usage.used);
}
