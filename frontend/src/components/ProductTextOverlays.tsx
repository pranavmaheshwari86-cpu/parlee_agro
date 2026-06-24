"use client";

import { motion, useTransform, useMotionValue, type MotionValue } from "framer-motion";
import type { Product } from "@/data/products";

interface ProductTextOverlaysProps {
  product: Product;
  progress: MotionValue<number>;
  isDark?: boolean;
}

interface TextSectionProps {
  title: string;
  subtitle: string;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  isDark?: boolean;
}

function TextSection({ title, subtitle, opacity, y, isDark }: TextSectionProps) {
  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none col-start-1 row-start-1 w-full px-3 sm:px-8"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2
          className={`text-3xl sm:text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl font-serif ${
            isDark ? "text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]" : "text-gray-900 drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]"
          }`}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            className={`mx-auto mt-4 max-w-2xl text-lg font-light md:text-xl ${
              isDark ? "text-white/80" : "text-gray-700"
            }`}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}

export default function ProductTextOverlays({
  product,
  progress,
  isDark = false,
}: ProductTextOverlaysProps) {
  // Fallback in case progress is undefined during SSR or due to stale props
  const fallbackProgress = useMotionValue(0);
  const activeProgress = progress || fallbackProgress;

  // Section 1: 0% - 20% of scroll
  const opacity1 = useTransform(
    activeProgress,
    [0, 0.03, 0.15, 0.2],
    [1, 1, 1, 0]
  );
  const y1 = useTransform(
    activeProgress,
    [0, 0.03, 0.15, 0.2],
    [0, 0, 0, -40]
  );

  // Section 2: 20% - 45% of scroll
  const opacity2 = useTransform(
    activeProgress,
    [0.2, 0.25, 0.38, 0.45],
    [0, 1, 1, 0]
  );
  const y2 = useTransform(
    activeProgress,
    [0.2, 0.25, 0.38, 0.45],
    [40, 0, 0, -40]
  );

  // Section 3: 45% - 70% of scroll
  const opacity3 = useTransform(
    activeProgress,
    [0.45, 0.5, 0.63, 0.7],
    [0, 1, 1, 0]
  );
  const y3 = useTransform(
    activeProgress,
    [0.45, 0.5, 0.63, 0.7],
    [40, 0, 0, -40]
  );

  // Section 4: 70% - 100% of scroll
  const opacity4 = useTransform(
    activeProgress,
    [0.7, 0.76, 0.9, 1],
    [0, 1, 1, 1]
  );
  const y4 = useTransform(
    activeProgress,
    [0.7, 0.76, 0.9, 1],
    [40, 0, 0, 0]
  );

  return (
    <div className="pointer-events-none w-full grid place-items-center">
      <TextSection
        title={product.section1.title}
        subtitle={product.section1.subtitle}
        opacity={opacity1}
        y={y1}
        isDark={isDark}
      />
      <TextSection
        title={product.section2.title}
        subtitle={product.section2.subtitle}
        opacity={opacity2}
        y={y2}
        isDark={isDark}
      />
      <TextSection
        title={product.section3.title}
        subtitle={product.section3.subtitle}
        opacity={opacity3}
        y={y3}
        isDark={isDark}
      />
      <TextSection
        title={product.section4.title}
        subtitle={product.section4.subtitle}
        opacity={opacity4}
        y={y4}
        isDark={isDark}
      />
    </div>
  );
}
