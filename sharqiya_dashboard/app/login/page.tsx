"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { API_BASE, apiErrorMessage } from "@/lib/api";
import { useT } from "@/lib/i18n/use-t";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { AuthUser } from "@/lib/types";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

type LoginValues = { email: string; password: string };

export default function LoginPage() {
  const router = useRouter();
  const t = useT();
  const { accessToken, hydrated, hydrate, setAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.email(t("login.emailInvalid")),
        password: z.string().min(1, t("login.passwordRequired")),
      }),
    [t],
  );

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (hydrated && accessToken) router.replace("/");
  }, [hydrated, accessToken, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    setError(null);
    try {
      const res = await axios.post<{ accessToken: string; user: AuthUser }>(
        `${API_BASE}/auth/login`,
        values,
        { withCredentials: true },
      );
      setAuth(res.data.accessToken, res.data.user);
      router.replace("/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError(t("login.invalidCredentials"));
      } else {
        setError(apiErrorMessage(err));
      }
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <div className="absolute end-4 top-4">
        <LocaleSwitcher />
      </div>
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-brand-50 to-transparent" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-sm"
      >
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-900/5">
          <div className="mb-6 flex flex-col items-center text-center">
            <Image
              src="/logo.webp"
              alt="Al-Sharqiya"
              width={72}
              height={72}
              className="mb-3 object-contain"
              priority
            />
            <h1 className="text-lg font-semibold text-zinc-900">Al-Sharqiya</h1>
            <p className="text-sm text-zinc-500">{t("login.subtitle")}</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              label={t("login.email")}
              error={errors.email?.message}
              required
            >
              <Input
                type="email"
                autoComplete="email"
                placeholder="admin@alsharqiya.ae"
                {...register("email")}
              />
            </FormField>
            <FormField
              label={t("login.password")}
              error={errors.password?.message}
              required
            >
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pe-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 end-0 flex cursor-pointer items-center px-3 text-zinc-400 transition hover:text-zinc-600"
                  aria-label={
                    showPassword
                      ? t("login.hidePassword")
                      : t("login.showPassword")
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </FormField>

            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isSubmitting}
            >
              {t("login.submit")}
            </Button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-zinc-400">
          © {new Date().getFullYear()} Al-Sharqiya Gypsum &amp; GRC Group
        </p>
      </motion.div>
    </div>
  );
}
