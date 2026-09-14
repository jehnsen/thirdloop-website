"use client";

import { ExternalLink, LayoutDashboard, LogOut, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
];

const itemClass =
  "inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-loop-400";

/** Top bar on small screens, sticky sidebar from `lg` up. */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-30 border-b border-white/8 bg-ink-950/90 backdrop-blur-xl lg:h-screen lg:border-r lg:border-b-0">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:h-full lg:flex-col lg:items-stretch lg:gap-8 lg:px-4 lg:py-6">
        <Link
          href="/admin"
          className="inline-flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-loop-400 lg:px-2"
          aria-label="3rdLoop admin — dashboard"
        >
          <LogoMark className="size-8" />
          <span className="hidden text-[0.95rem] font-semibold tracking-tight text-white sm:inline">
            3rdLoop
            <span className="ml-1 font-normal text-white/45">Admin</span>
          </span>
        </Link>

        <nav aria-label="Admin" className="flex flex-1 items-center gap-1 lg:flex-col lg:items-stretch">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin" ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  itemClass,
                  active
                    ? "bg-white/8 text-white"
                    : "text-white/55 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon aria-hidden className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 lg:flex-col lg:items-stretch lg:border-t lg:border-white/8 lg:pt-4">
          <a
            href="/products"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View site (opens in a new tab)"
            title="View site"
            className={cn(itemClass, "text-white/55 hover:bg-white/5 hover:text-white")}
          >
            <ExternalLink aria-hidden className="size-4" />
            <span className="hidden sm:inline">View site</span>
          </a>
          <form action={logout}>
            <button
              type="submit"
              aria-label="Sign out"
              title="Sign out"
              className={cn(
                itemClass,
                "w-full text-white/55 hover:bg-white/5 hover:text-white",
              )}
            >
              <LogOut aria-hidden className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
