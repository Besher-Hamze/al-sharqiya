"use client";

import { create } from "zustand";
import type { AuthUser } from "@/lib/types";

const TOKEN_KEY = "sharqiya_access_token";
const USER_KEY = "sharqiya_user";

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  /** False until `hydrate()` has read localStorage, so guards do not flash. */
  hydrated: boolean;
  setAuth: (token: string, user?: AuthUser | null) => void;
  setToken: (token: string) => void;
  clear: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  hydrated: false,

  setAuth: (token, user) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // storage unavailable — fall back to in-memory only
    }
    set({ accessToken: token, user: user ?? get().user, hydrated: true });
  },

  setToken: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // ignore
    }
    set({ accessToken: token });
  },

  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
    set({ accessToken: null, user: null, hydrated: true });
  },

  hydrate: () => {
    if (get().hydrated) return;
    let token: string | null = null;
    let user: AuthUser | null = null;
    try {
      token = localStorage.getItem(TOKEN_KEY);
      const raw = localStorage.getItem(USER_KEY);
      if (raw) user = JSON.parse(raw) as AuthUser;
    } catch {
      // ignore
    }
    set({ accessToken: token, user, hydrated: true });
  },
}));

/** Role helpers — the backend enforces these too; this only shapes the UI. */
export function canManage(role: string | undefined): boolean {
  return role === "superadmin" || role === "admin";
}

export function isSuperadmin(role: string | undefined): boolean {
  return role === "superadmin";
}
