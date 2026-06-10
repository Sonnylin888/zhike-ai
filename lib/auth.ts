"use client";

import defaultUsers from "@/data/users.json";
import { readStorageList, upsertById, writeStorageList } from "@/lib/adminStorage";

export type UserRole = "admin" | "agent" | "school" | "demo";

export type ZhikeUser = {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  displayName: string;
  watermark: string;
  dailyLimit: number;
  modelProvider: string;
  modelName: string;
  apiKeyId: string;
  enabled: boolean;
};

export const usersStorageKey = "zhike_users";
export const currentUserStorageKey = "zhike_current_user";
export const authChangedEvent = "zhike-auth-changed";

export function getUsers() {
  return readStorageList<ZhikeUser>(usersStorageKey, defaultUsers as ZhikeUser[]);
}

export function saveUsers(users: ZhikeUser[]) {
  writeStorageList(usersStorageKey, users);
  window.dispatchEvent(new Event(authChangedEvent));
}

export function saveUser(user: ZhikeUser) {
  saveUsers(upsertById(getUsers(), user));
}

export function login(username: string, password: string) {
  const user = getUsers().find(
    (item) => item.username === username.trim() && item.password === password && item.enabled
  );
  if (!user) return null;
  saveSession(user);
  return user;
}

export function logout() {
  clearSession();
}

export function saveSession(user: ZhikeUser) {
  window.localStorage.setItem(currentUserStorageKey, JSON.stringify(user));
  window.dispatchEvent(new Event(authChangedEvent));
}

export function clearSession() {
  window.localStorage.removeItem(currentUserStorageKey);
  window.dispatchEvent(new Event(authChangedEvent));
}

export function getCurrentUser(): ZhikeUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(currentUserStorageKey);
    if (!stored) return null;
    const session = JSON.parse(stored) as ZhikeUser;
    const fresh = getUsers().find((user) => user.id === session.id && user.enabled);
    return fresh || null;
  } catch {
    clearSession();
    return null;
  }
}

export function requireAuth() {
  return getCurrentUser();
}

export function isAdmin(user: ZhikeUser | null) {
  return user?.role === "admin";
}
