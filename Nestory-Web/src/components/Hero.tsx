"use client";

import { motion } from "framer-motion";
import { PhoneMockup } from "./PhoneMockup";

export function Hero({
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--brand-green)_0%,_transparent_55%)] opacity-15" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-green-dark">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h1>
          <p className="mt-6 max-w-lg text-lg text-brand-muted">{subtitle}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#features"
              className="rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-brand-cream shadow-lg shadow-brand-green/20 transition-transform hover:scale-105"
            >
              {ctaPrimary}
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border border-black/10 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-green-dark hover:text-brand-green-dark"
            >
              {ctaSecondary}
            </a>
          </div>
        </div>

        <div style={{ perspective: "1400px" }} className="flex justify-center">
          <motion.div
            initial={{ rotateY: -18, rotateX: 8, y: 0 }}
            animate={{ rotateY: [-18, -10, -18], y: [0, -14, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <PhoneMockup variant="pantry" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
