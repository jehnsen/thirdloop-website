import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: {
    template: "%s · Admin — 3rdLoop Solutions",
    default: "Admin — 3rdLoop Solutions",
  },
  robots: { index: false, follow: false },
};

// No auth check here: layouts don't re-render on navigation, so each page
// calls requireAdmin() itself.
export default function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen w-full bg-ink-950 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <AdminNav />
      <main id="main" className="px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
