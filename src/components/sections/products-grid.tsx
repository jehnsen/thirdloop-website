"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EASE, Reveal } from "@/components/ui/motion-primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { productCategories, products, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

const statusStyles: Record<Product["status"], string> = {
  Live: "border-flux-400/40 bg-flux-500/12 text-flux-300",
  Demo: "border-loop-400/40 bg-loop-500/12 text-loop-200",
  "In development": "border-white/15 bg-white/5 text-white/55",
};

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon;

  return (
    <SpotlightCard glowColor={product.accent} className="h-full">
      <Link
        href={`/products/${product.slug}`}
        className="flex h-full flex-col p-7 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-loop-400"
      >
        <div className="flex items-start justify-between gap-4">
          <div
            className="inline-flex size-11 items-center justify-center rounded-xl border border-white/10 transition-transform duration-500 group-hover:scale-110"
            style={{
              background: `color-mix(in oklab, ${product.accent} 16%, transparent)`,
            }}
          >
            <Icon className="size-5" style={{ color: product.accent }} />
          </div>

          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-[0.62rem] font-medium whitespace-nowrap",
              statusStyles[product.status],
            )}
          >
            {product.status}
          </span>
        </div>

        <div className="mt-5 text-[0.68rem] tracking-wide text-white/35 uppercase">
          {product.industry}
        </div>

        <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
          {product.name}
        </h3>

        <p className="mt-1.5 text-sm leading-snug text-pretty text-white/60">
          {product.tagline}
        </p>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-pretty text-white/45">
          {product.summary}
        </p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {product.stack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-[0.65rem] text-white/50"
            >
              {tech}
            </span>
          ))}
          {product.stack.length > 3 ? (
            <span className="rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-[0.65rem] text-white/35">
              +{product.stack.length - 3}
            </span>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-5">
          <span
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: product.accent }}
          >
            View details
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          {product.url ? (
            <span className="inline-flex items-center gap-1 text-[0.7rem] text-white/35">
              <ExternalLink className="size-3" />
              Live site
            </span>
          ) : null}
        </div>
      </Link>
    </SpotlightCard>
  );
}

export function ProductsGrid() {
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(
    () =>
      category === "All"
        ? products
        : products.filter((product) => product.category === category),
    [category],
  );

  return (
    <>
      <Reveal delay={0.1}>
        <div
          role="tablist"
          aria-label="Filter products by category"
          className="flex flex-wrap justify-center gap-2"
        >
          {productCategories.map((option) => {
            const isActive = option === category;
            const count =
              option === "All"
                ? products.length
                : products.filter((p) => p.category === option).length;

            return (
              <button
                key={option}
                role="tab"
                aria-selected={isActive}
                onClick={() => setCategory(option)}
                className={cn(
                  "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-loop-400",
                  isActive ? "text-white" : "text-white/50 hover:text-white/85",
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="product-filter"
                    className="absolute inset-0 rounded-full border border-white/12 bg-white/7"
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                ) : null}
                <span className="relative z-10">{option}</span>
                <span className="relative z-10 text-[0.7rem] text-white/35">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <motion.ul
        layout
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <motion.li
              key={product.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <ProductCard product={product} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
}
