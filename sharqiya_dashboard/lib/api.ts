"use client";

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/lib/stores/auth-store";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export const ASSET_BASE =
  process.env.NEXT_PUBLIC_ASSET_URL ?? "http://localhost:4000";

export function assetUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  let normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.startsWith("/media/")) {
    normalized = `/uploads${normalized}`;
  } else if (!normalized.startsWith("/uploads/")) {
    normalized = `/uploads/media${normalized}`;
  }

  return `${ASSET_BASE.replace(/\/$/, "")}${normalized}`;
}

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ accessToken: string }>(
        `${API_BASE}/auth/refresh`,
        {},
        { withCredentials: true },
      )
      .then((res) => {
        const token = res.data.accessToken;
        useAuthStore.getState().setToken(token);
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const isAuthRoute = config?.url?.includes("/auth/");
    if (
      error.response?.status === 401 &&
      config &&
      !config._retried &&
      !isAuthRoute
    ) {
      config._retried = true;
      try {
        const token = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${token}`;
        return api(config);
      } catch {
        useAuthStore.getState().clear();
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/login")
        ) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string | string[] }
      | undefined;
    if (data?.message) {
      return Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message;
    }
    if (error.response?.status === 401) return "Unauthorized.";
    if (error.response?.status === 403) return "You do not have permission.";
    return error.message;
  }
  return "Unknown error.";
}
