import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { PageBackdrop } from "@/components/ui/backdrop";
import { LogoMark } from "@/components/ui/logo";
import { isAdminConfigured } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ next?: string | string[] }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const { next } = await searchParams;

  return (
    <>
      <PageBackdrop />
      <main id="main" className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center">
            <LogoMark className="size-11" />
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-white">
              Admin sign in
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Manage the products shown on the 3rdLoop site.
            </p>
          </div>

          <div className="glass-panel mt-8 rounded-2xl p-6">
            {isAdminConfigured() ? (
              <LoginForm next={typeof next === "string" ? next : undefined} />
            ) : (
              <p className="text-sm leading-relaxed text-white/60">
                Admin access isn&apos;t set up on this server yet. Set{" "}
                <code className="font-mono text-loop-200">ADMIN_PASSWORD</code>{" "}
                and{" "}
                <code className="font-mono text-loop-200">
                  ADMIN_SESSION_SECRET
                </code>{" "}
                in the environment, then restart.
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
