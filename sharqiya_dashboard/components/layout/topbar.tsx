"use client";

import axios from "axios";
import { ChevronDown, ExternalLink, LogOut, Menu, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { API_BASE } from "@/lib/api";
import { useT } from "@/lib/i18n/use-t";
import { useAuthStore } from "@/lib/stores/auth-store";
import { LocaleSwitcher } from "./locale-switcher";

export function Topbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const router = useRouter();
  const t = useT();
  const { user, clear } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const websiteUrl =
    process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3018/en";

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
    } catch {
      // refresh token may already be invalid
    }
    clear();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur lg:px-6">
      <button
        onClick={onOpenMobile}
        className="cursor-pointer rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 lg:hidden"
        aria-label={t("nav.openMenu")}
      >
        <Menu className="size-5" />
      </button>

      <LocaleSwitcher compact />

      <a
        href={websiteUrl}
        target="_blank"
        rel="noreferrer"
        className="ms-auto hidden items-center gap-1.5 text-xs text-zinc-500 transition hover:text-zinc-800 sm:flex"
      >
        {t("common.openWebsite")}
        <ExternalLink className="size-3.5" />
      </a>

      <div className="relative ms-auto sm:ms-0" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-zinc-100"
        >
          <span className="flex size-7 items-center justify-center rounded-full brand-gradient text-xs font-semibold text-white">
            {(user?.name ?? user?.email ?? "?").charAt(0).toUpperCase()}
          </span>
          <span className="hidden text-start sm:block">
            <span className="block text-xs font-medium text-zinc-800">
              {user?.name ?? user?.email}
            </span>
            <span className="block text-[11px] text-zinc-400">
              {t(`roles.${user?.role ?? "editor"}`)}
            </span>
          </span>
          <ChevronDown className="size-3.5 text-zinc-400" />
        </button>

        {menuOpen && (
          <div className="absolute end-0 top-full mt-1 w-52 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
            <div className="border-b border-zinc-100 px-3 py-2">
              <p className="flex items-center gap-1.5 text-xs font-medium text-zinc-800">
                <UserRound className="size-3.5 text-zinc-400" />
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-start text-sm text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="size-4" />
              {t("common.logout")}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
