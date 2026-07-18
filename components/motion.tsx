"use client";

import { MotionConfig, motion } from "framer-motion";
import type { ReactNode } from "react";

/** Honors prefers-reduced-motion for every framer-motion animation. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

const EASE = [0.21, 0.65, 0.36, 1] as const;

/** Scroll-triggered fade/slide-up reveal. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
