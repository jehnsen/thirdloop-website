"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { EASE, Reveal } from "@/components/ui/motion-primitives";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How quickly can you start?",
    answer:
      "Discovery usually begins within one to two weeks of signing. Build capacity depends on the quarter — we deliberately cap concurrent engagements so teams aren't split across five projects. If we can't start when you need us, we'll say so on the first call.",
  },
  {
    question: "Do you work with our existing team and codebase?",
    answer:
      "Often, yes. A large share of our work is joining an existing team — auditing what's there, unblocking delivery and levelling up practices rather than rewriting from scratch. We recommend a rewrite only when the maths genuinely favours it, and we'll show you that maths.",
  },
  {
    question: "Who owns the code and the IP?",
    answer:
      "You do, in full, from the first commit. Everything lives in your repositories and cloud accounts. There's no proprietary framework you have to license and no hosting you're locked into. Handover includes documentation and training so your team can take over completely.",
  },
  {
    question: "How do you price work that's hard to scope?",
    answer:
      "We start with a fixed-price discovery. At the end you get a written architecture and a roadmap with estimates per phase — then you decide whether to proceed, take the plan to another team, or stop. Nobody signs a six-figure build based on a guess.",
  },
  {
    question: "Is AI always the right answer?",
    answer:
      "No, and we'll tell you when it isn't. Plenty of problems that look like AI problems are really data-quality or process problems, and a deterministic pipeline solves them more cheaply and reliably. When AI does fit, we build evaluation harnesses so you can measure accuracy rather than trust a demo.",
  },
  {
    question: "What happens after launch?",
    answer:
      "Every build includes 30 days of post-launch support, documentation and team training. From there you can take it fully in-house or move onto a Partner retainer for ongoing delivery. Both are genuinely fine — we'd rather you leave capable than stay dependent.",
  },
];

function FaqItem({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: (typeof faqs)[number];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <Reveal delay={index * 0.05} as="li">
      <div
        className={cn(
          "overflow-hidden rounded-2xl border transition-colors duration-500",
          isOpen
            ? "border-white/15 bg-white/5"
            : "border-white/8 bg-white/2 hover:border-white/14",
        )}
      >
        <h3>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-loop-400 sm:px-7"
          >
            <span
              className={cn(
                "text-[0.98rem] font-medium transition-colors duration-300 sm:text-base",
                isOpen ? "text-white" : "text-white/80",
              )}
            >
              {faq.question}
            </span>
            <motion.span
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                isOpen
                  ? "border-loop-400/40 bg-loop-500/15 text-loop-200"
                  : "border-white/12 text-white/50",
              )}
            >
              <Plus className="size-3.5" />
            </motion.span>
          </button>
        </h3>

        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <p className="px-6 pb-6 text-sm leading-relaxed text-pretty text-white/55 sm:px-7 sm:pb-7">
                {faq.answer}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeader
            align="left"
            eyebrow="Questions"
            title={
              <>
                Things people ask{" "}
                <span className="text-gradient">before signing</span>
              </>
            }
            description="If yours isn't here, ask it on the call — we answer directly, including when the answer is no."
            className="lg:sticky lg:top-28 lg:self-start"
          />

          <ul className="space-y-3">
            {faqs.map((faq, index) => (
              <FaqItem
                key={faq.question}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
