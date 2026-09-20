import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/ui/logo";
import { Container } from "@/components/ui/section";
import { footerExtraLinks, navLinks, site } from "@/lib/site";

const serviceLinks = [
  "Web Development",
  "Mobile Apps",
  "Intelligent Automation",
  "AI Solutions",
  "Consultancy",
];

export function Footer() {
  return (
    <footer className="relative border-t border-hair/20 bg-ink-950/40">
      <Container>
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <LogoMark className="size-8" />
              <span className="font-display text-[15px] font-semibold tracking-tight text-cream">
                3rdLoop <span className="text-mist">Solutions</span>
              </span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-pretty text-mist">
              {site.description}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="group mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.15em] text-flux-500 uppercase transition-colors hover:text-flux-400"
            >
              {site.email}
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <p className="mt-3 text-xs leading-relaxed text-pretty text-mist/70">
              {site.officeAddress}
            </p>
          </div>

          <div>
            <h3 className="font-mono text-[10px] tracking-[0.25em] text-mist/70 uppercase">
              Navigate
            </h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.kind === "hash" ? `/${link.href}` : link.href}
                    className="text-sm text-mist transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {footerExtraLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-mist transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[10px] tracking-[0.25em] text-mist/70 uppercase">
              Services
            </h3>
            <ul className="mt-5 space-y-3">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <Link
                    href="/#services"
                    className="text-sm text-mist transition-colors hover:text-cream"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[10px] tracking-[0.25em] text-mist/70 uppercase">
              Elsewhere
            </h3>
            <ul className="mt-5 space-y-3">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm text-mist transition-colors hover:text-cream"
                  >
                    {social.label}
                    <ArrowUpRight className="size-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-hair/20 py-7 sm:flex-row">
          <p className="font-mono text-[10px] tracking-[0.15em] text-mist/70 uppercase">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="font-mono text-[10px] tracking-[0.15em] text-mist/70 uppercase">{site.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
