"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { ShowcaseItem } from "@/content/types";
import { PhoneMockup, type MockupVariant } from "./PhoneMockup";

const VARIANTS: MockupVariant[] = ["pantry", "shopping", "bills", "waste", "family"];

export function ScrollShowcase({
  eyebrow,
  title,
  subtitle,
  items,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: ShowcaseItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const total = items.length;

  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-green-dark">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h2>
        <p className="mt-4 text-brand-muted">{subtitle}</p>
      </div>

      <div ref={containerRef} className="relative mt-16" style={{ height: `${total * 90}vh` }}>
        <div className="sticky top-20 grid items-center gap-10 md:grid-cols-2">
          <div style={{ perspective: "1400px" }} className="relative hidden h-[520px] items-center justify-center md:flex">
            {items.map((_, i) => (
              <PhonePanel key={i} index={i} total={total} progress={scrollYProgress} variant={VARIANTS[i % VARIANTS.length]} />
            ))}
          </div>

          <div className="relative flex h-[420px] flex-col justify-center md:h-[520px]">
            {items.map((item, i) => (
              <TextPanel key={i} index={i} total={total} progress={scrollYProgress} item={item} />
            ))}
          </div>

          <div className="flex justify-center gap-2 md:hidden">
            {items.map((item, i) => (
              <div key={i} className="rounded-2xl bg-white/60 p-4 text-center shadow-sm">
                <PhoneMockup variant={VARIANTS[i % VARIANTS.length]} />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-brand-green-dark">{item.tag}</p>
                <p className="mt-1 text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-brand-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhonePanel({
  index,
  total,
  progress,
  variant,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  variant: MockupVariant;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const mid = (start + end) / 2;

  const opacity = useTransform(progress, [start, start + 0.04, end - 0.04, end], [0, 1, 1, 0]);
  const rotateY = useTransform(progress, [start, mid, end], [28, 0, -28]);
  const rotateX = useTransform(progress, [start, mid, end], [6, 0, -6]);
  const scale = useTransform(progress, [start, mid, end], [0.92, 1, 0.92]);

  return (
    <motion.div
      className="absolute"
      style={{
        opacity,
        rotateY,
        rotateX,
        scale,
        transformStyle: "preserve-3d",
      }}
    >
      <PhoneMockup variant={variant} />
    </motion.div>
  );
}

function TextPanel({
  index,
  total,
  progress,
  item,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  item: ShowcaseItem;
}) {
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(progress, [start, start + 0.04, end - 0.04, end], [0, 1, 1, 0]);
  const x = useTransform(progress, [start, start + 0.04, end - 0.04, end], [24, 0, 0, -24]);

  return (
    <motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity, x }}>
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-green-dark">{item.tag}</span>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{item.title}</h3>
      <p className="mt-4 max-w-md text-brand-muted">{item.description}</p>
    </motion.div>
  );
}
