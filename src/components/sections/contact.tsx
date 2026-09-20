"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check, Loader2, Mail, MapPin } from "lucide-react";
import { useState, type FormEvent } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { EASE, Reveal } from "@/components/ui/motion-primitives";
import { Container, Section } from "@/components/ui/section";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const services = [
  "Web development",
  "Mobile app",
  "Automation",
  "AI solution",
  "Consultancy",
  "Not sure yet",
];

const budgets = ["< $10k", "$10k – $25k", "$25k – $75k", "$75k+", "Retainer"];

type Status = "idle" | "submitting" | "success";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-xs font-medium tracking-wide text-mist">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-hair/20 bg-white/4 px-4 py-3 text-sm text-cream placeholder:text-mist/70 transition-colors duration-300 focus:border-flux-400/60 focus:bg-white/6 focus:outline-none";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>("");

  function toggleService(service: string) {
    setSelectedServices((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    // No backend wired up yet — swap this for your form handler / API route.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("success");
  }

  return (
    <Section id="contact" className="pb-16 sm:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-hair/20">
          {/* animated gradient wash */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-ink-900"
          >
            <div className="absolute -top-32 -left-20 size-[28rem] animate-drift rounded-full bg-loop-600/25 blur-[110px]" />
            <div className="absolute -right-20 -bottom-32 size-[26rem] animate-drift-slow rounded-full bg-plasma-600/20 blur-[110px]" />
          </div>

          <div className="relative grid gap-12 p-8 sm:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:p-14">
            {/* Left: pitch */}
            <div>
              <Reveal>
                <h2 className="text-3xl font-display font-semibold tracking-tight text-balance text-cream sm:text-4xl sm:leading-tight">
                  Let&apos;s scope your{" "}
                  <span className="text-gradient">next loop</span>
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="mt-5 leading-relaxed text-pretty text-mist">
                  Tell us what you&apos;re trying to build or fix. You&apos;ll
                  hear back within one business day, and the first call is a
                  free 30-minute conversation — no deck, no pressure.
                </p>
              </Reveal>

              <Reveal delay={0.16}>
                <dl className="mt-10 space-y-5">
                  <div className="flex items-start gap-3.5">
                    <Mail className="mt-0.5 size-4 shrink-0 text-loop-300" />
                    <div>
                      <dt className="sr-only">Email</dt>
                      <dd>
                        <a
                          href={`mailto:${site.email}`}
                          className="text-sm text-mist transition-colors hover:text-cream"
                        >
                          {site.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-flux-400" />
                    <div>
                      <dt className="sr-only">Location</dt>
                      <dd className="text-sm text-mist">
                        {site.location}
                        <span className="mt-1 block text-xs text-mist/70">
                          {site.officeAddress}
                        </span>
                      </dd>
                    </div>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={0.22}>
                <div className="mt-10 flex items-center gap-3 rounded-xl border border-hair/20 bg-white/3 px-4 py-3.5">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-flux-400" />
                    <span className="relative inline-flex size-2 rounded-full bg-flux-400" />
                  </span>
                  <span className="text-xs text-mist">
                    Currently taking on projects for next quarter
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Right: form */}
            <Reveal delay={0.12}>
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="glass-panel flex h-full min-h-80 flex-col items-center justify-center rounded-2xl p-10 text-center"
                >
                  <div className="flex size-14 items-center justify-center rounded-full bg-flux-500/15">
                    <Check className="size-7 text-flux-400" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-cream">
                    Message received
                  </h3>
                  <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-mist">
                    Thanks for reaching out. We&apos;ll come back to you within
                    one business day with next steps.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="glass-panel rounded-2xl p-7 sm:p-8"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Name">
                      <input
                        required
                        name="name"
                        type="text"
                        placeholder="Jane Doe"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Work email">
                      <input
                        required
                        name="email"
                        type="email"
                        placeholder="jane@company.com"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field label="Company" className="mt-5">
                    <input
                      name="company"
                      type="text"
                      placeholder="Company name"
                      className={inputClass}
                    />
                  </Field>

                  <fieldset className="mt-6">
                    <legend className="mb-3 text-xs font-medium tracking-wide text-mist">
                      What do you need? (select any)
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {services.map((service) => {
                        const selected = selectedServices.includes(service);
                        return (
                          <button
                            key={service}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleService(service)}
                            className={cn(
                              "rounded-full border px-3.5 py-1.5 text-xs transition-all duration-300",
                              selected
                                ? "border-loop-400/50 bg-loop-500/18 text-loop-100"
                                : "border-hair/20 bg-white/3 text-mist hover:border-hair/35 hover:text-cream",
                            )}
                          >
                            {service}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="hidden"
                      name="services"
                      value={selectedServices.join(", ")}
                    />
                  </fieldset>

                  <fieldset className="mt-6">
                    <legend className="mb-3 text-xs font-medium tracking-wide text-mist">
                      Budget range
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {budgets.map((option) => (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={budget === option}
                          onClick={() => setBudget(option)}
                          className={cn(
                            "rounded-full border px-3.5 py-1.5 text-xs transition-all duration-300",
                            budget === option
                              ? "border-flux-400/50 bg-flux-500/18 text-flux-300"
                              : "border-hair/20 bg-white/3 text-mist hover:border-hair/35 hover:text-cream",
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <input type="hidden" name="budget" value={budget} />
                  </fieldset>

                  <Field label="Tell us about the project" className="mt-6">
                    <textarea
                      required
                      name="message"
                      rows={4}
                      placeholder="What are you building, what's blocking you, and when do you need it live?"
                      className={cn(inputClass, "resize-none")}
                    />
                  </Field>

                  <div className="mt-7">
                    <MagneticButton
                      type="submit"
                      className="w-full py-3.5"
                      disabled={status === "submitting"}
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send message
                          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </>
                      )}
                    </MagneticButton>
                  </div>

                  <p className="mt-4 text-center text-[0.7rem] text-mist/60">
                    We&apos;ll never share your details. No newsletter, no
                    follow-up sequence.
                  </p>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
