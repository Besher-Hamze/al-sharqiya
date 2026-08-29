"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  FileText,
  FolderOpen,
  Hammer,
  Images,
  Inbox,
  LayoutDashboard,
  List,
  MessageSquare,
  ScrollText,
  Settings,
  Star,
  Users,
  Briefcase,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { useT } from "@/lib/i18n/use-t";
import { cn } from "@/lib/utils";

interface NavEntry {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  titleKey: string;
  items: NavEntry[];
}

const groups: NavGroup[] = [
  {
    titleKey: "nav.groups.overview",
    items: [
      { href: "/", labelKey: "nav.dashboard", icon: LayoutDashboard },
      { href: "/quotes", labelKey: "nav.quotes", icon: Briefcase },
      { href: "/messages", labelKey: "nav.messages", icon: Inbox },
    ],
  },
  {
    titleKey: "nav.groups.content",
    items: [
      { href: "/services", labelKey: "nav.services", icon: Hammer },
      { href: "/projects", labelKey: "nav.projects", icon: FileText },
      { href: "/content", labelKey: "nav.content", icon: ScrollText },
      { href: "/pages", labelKey: "nav.pages", icon: FileText },
      { href: "/gallery", labelKey: "nav.gallery", icon: Images },
      { href: "/media", labelKey: "nav.media", icon: FolderOpen },
      { href: "/testimonials", labelKey: "nav.testimonials", icon: Star },
      { href: "/faq", labelKey: "nav.faq", icon: MessageSquare },
    ],
  },
  {
    titleKey: "nav.groups.admin",
    items: [
      { href: "/navigation", labelKey: "nav.navigation", icon: List },
      { href: "/settings", labelKey: "nav.settings", icon: Settings },
      { href: "/users", labelKey: "nav.users", icon: Users },
      { href: "/activity", labelKey: "nav.activity", icon: Activity },
    ],
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const t = useT();

  const { data: unread } = useQuery({
    queryKey: ["contact", "unread-count"],
    queryFn: async () => {
      const res = await api.get<{ count: number }>("/contact/unread-count");
      return res.data.count;
    },
    refetchInterval: 60_000,
  });

  const { data: newQuotes } = useQuery({
    queryKey: ["quotes", "new-count"],
    queryFn: async () => {
      const res = await api.get<{ count: number }>("/quotes/new-count");
      return res.data.count;
    },
    refetchInterval: 60_000,
  });

  const nav = (
    <nav className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-zinc-100 px-4 py-4">
        <Image
          src="/logo.webp"
          alt="Al-Sharqiya"
          width={36}
          height={36}
          className="object-contain"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-900">
            Al-Sharqiya
          </p>
          <p className="text-[11px] text-zinc-400">{t("nav.brandSubtitle")}</p>
        </div>
        <button
          onClick={onCloseMobile}
          className="ms-auto cursor-pointer rounded-md p-1 text-zinc-400 hover:bg-zinc-100 lg:hidden"
          aria-label={t("nav.closeMenu")}
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.titleKey} className="mb-5">
            <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              {t(group.titleKey)}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const badge =
                  item.href === "/messages"
                    ? unread
                    : item.href === "/quotes"
                      ? newQuotes
                      : 0;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onCloseMobile}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] font-medium transition",
                        active
                          ? "bg-brand-50 text-brand-700"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "size-4",
                          active ? "text-brand-600" : "text-zinc-400",
                        )}
                      />
                      {t(item.labelKey)}
                      {(badge ?? 0) > 0 && (
                        <span className="ms-auto rounded-full bg-brand-600 px-1.5 py-px text-[10px] font-semibold text-white">
                          {badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );

  return (
    <>
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-60 border-e border-zinc-200 bg-white lg:block">
        {nav}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-zinc-900/40"
            onClick={onCloseMobile}
          />
          <aside className="absolute inset-y-0 start-0 w-64 bg-white shadow-xl">
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
