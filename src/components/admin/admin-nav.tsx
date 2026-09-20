"use client";

import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Receipt,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/services", label: "Services", icon: Workflow },
  { href: "/admin/pricing", label: "Pricing", icon: Receipt },
  { href: "/admin/testimonials", label: "Feedback", icon: MessageSquare },
];

const itemClass =
  "inline-flex items-center gap-2.5 rounded-lg px-3 py-2 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flux-400";

/** Top bar on small screens, sticky sidebar from `lg` up. */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-30 border-b border-hair/20 bg-ink-950/90 backdrop-blur-xl lg:h-screen lg:border-r lg:border-b-0">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:h-full lg:flex-col lg:items-stretch lg:gap-8 lg:px-4 lg:py-6">
        <Link
          href="/admin"
          className="inline-flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-flux-400 lg:px-2"
          aria-label="3rdLoop admin — dashboard"
        >
          <LogoMark className="size-8" />
          <span className="hidden text-[0.95rem] font-display font-semibold tracking-tight text-cream sm:inline">
            3rdLoop
            <span className="ml-1 font-normal text-mist/80">Admin</span>
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
                    ? "bg-white/8 text-cream"
                    : "text-mist hover:bg-white/5 hover:text-cream",
                )}
              >
                <Icon aria-hidden className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 lg:flex-col lg:items-stretch lg:border-t lg:border-hair/20 lg:pt-4">
          <a
            href="/products"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View site (opens in a new tab)"
            title="View site"
            className={cn(itemClass, "text-mist hover:bg-white/5 hover:text-cream")}
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
                "w-full text-mist hover:bg-white/5 hover:text-cream",
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
