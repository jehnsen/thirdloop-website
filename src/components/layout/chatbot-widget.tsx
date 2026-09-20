"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const CHATBOT_URL =
  process.env.NEXT_PUBLIC_CHATBOT_URL ?? "http://localhost:3001";

/** Floating toggle that reveals an embedded chatbot iframe, house pill style.
 * Kept off the admin panel — mounted once in the root layout otherwise. */
export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed right-4 bottom-20 z-100 h-[min(70vh,640px)] w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-hair/35 bg-ink-950 shadow-2xl sm:right-6 sm:bottom-24"
            role="dialog"
            aria-label="Chatbot"
          >
            <iframe
              src={CHATBOT_URL}
              title="Chatbot"
              className="h-full w-full border-0"
              allow="microphone"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-4 bottom-4 z-100 inline-flex h-14 w-14 items-center justify-center rounded-full bg-flux-500 text-ink-950 shadow-xl transition-colors duration-200 hover:bg-flux-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-flux-400 sm:right-6 sm:bottom-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "close" : "open"}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center"
          >
            {isOpen ? (
              <X className="h-6 w-6" strokeWidth={2} />
            ) : (
              <MessageCircle className="h-6 w-6" strokeWidth={2} />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </>
  );
}
