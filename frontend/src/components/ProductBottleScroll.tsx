"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Ref,
  type RefObject,
} from "react";
import { motion, animate, useMotionValue, useMotionValueEvent, useTransform, useSpring } from "framer-motion";
import type { Product } from "@/data/products";
import ProductTextOverlays from "./ProductTextOverlays";
import { MP4VideoPlayer } from "./video";

const FRAME_COUNT = 120;
const ANIMATION_DURATION_SECONDS = 4;

interface ProductBottleScrollProps {
  product: Product;
  containerRef: RefObject<HTMLDivElement | null>;
}

function framePath(folderPath: string, index: number): string {
  return `${folderPath}/${index + 1}.webp`;
}

export default function ProductBottleScroll({
  product,
  containerRef,
}: ProductBottleScrollProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [imagesReady, setImagesReady] = useState(false);
  const hasPlayedRef = useRef(false);
  const hasLoadedRef = useRef(false);
  const progressAnimRef = useRef<ReturnType<typeof animate> | null>(null);
  const videoAnimRef = useRef<ReturnType<typeof animate> | null>(null);

  const progress = useMotionValue(0);
  const videoProgress = useMotionValue(0);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img?.complete || !img.naturalWidth) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, []);

  const scheduleDraw = useCallback(
    (index: number) => {
      frameIndexRef.current = index;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        drawFrame(frameIndexRef.current);
      });
    },
    [drawFrame]
  );

  // Load images — only called once the container is near the viewport
  const loadImages = useCallback(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    let cancelled = false;
    setImagesReady(false);
    imagesRef.current = [];

    const doLoad = async () => {
      const loaded: HTMLImageElement[] = new Array(FRAME_COUNT);
      const promises = Array.from({ length: FRAME_COUNT }, (_, i) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.decoding = 'async';
          img.onload = () => {
            if (!cancelled) {
              loaded[i] = img;
              // Schedule initial draw but do NOT set ready yet
              if (i === (product.reverseFrames ? FRAME_COUNT - 1 : 0)) {
                scheduleDraw(i);
              }
            }
            resolve();
          };
          img.onerror = () => resolve();
          img.src = framePath(product.folderPath, i);
        });
      });

      // Don't await all, just set refs
      imagesRef.current = loaded;

      // Let them load in background
      Promise.all(promises).then(() => {
        if (!cancelled) {
          setImagesReady(true);
        }
      });
    };

    doLoad();

    // Return cleanup function
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [product.folderPath, product.reverseFrames, scheduleDraw]);

  // Reset loading state when product changes
  useEffect(() => {
    hasLoadedRef.current = false;
    setImagesReady(false);
    imagesRef.current = [];
  }, [product.folderPath]);

  // Update canvas frames as `videoProgress` changes
  useMotionValueEvent(videoProgress, "change", (latestProgress) => {
    let index = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.floor(latestProgress * (FRAME_COUNT - 1)))
    );
    if (product.reverseFrames) {
      index = FRAME_COUNT - 1 - index;
    }
    if (imagesRef.current.length > 0) {
      scheduleDraw(index);
    }
  });

  const stopAnimations = useCallback(() => {
    if (progressAnimRef.current) {
      progressAnimRef.current.stop();
      progressAnimRef.current = null;
    }
    if (videoAnimRef.current) {
      videoAnimRef.current.stop();
      videoAnimRef.current = null;
    }
  }, []);

  const playAnimation = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Stop any running animations before starting new ones
    stopAnimations();

    // Reset progress to 0 before playing
    progress.set(0);
    
    // Play the animation simply and purely without hijacking the user's scroll!
    progressAnimRef.current = animate(progress, 1, {
      duration: product.animationDuration || ANIMATION_DURATION_SECONDS,
      ease: "linear",
    });

    videoProgress.set(0);
    videoAnimRef.current = animate(videoProgress, 1, {
      duration: product.animationDuration || ANIMATION_DURATION_SECONDS,
      ease: "linear",
    });
  }, [progress, videoProgress, containerRef, product.animationDuration, stopAnimations]);

  // Intersection Observer: gate loading (400px margin) + trigger/stop animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let loadCleanup: (() => void) | undefined;

    // Observer for lazy-loading frames (400px ahead of viewport)
    const loadObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasLoadedRef.current) {
          loadCleanup = loadImages();
        }
      },
      { rootMargin: "400px" }
    );

    // Observer for play/stop animation (visible in viewport)
    const animObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && imagesReady) {
          if (!hasPlayedRef.current) {
            hasPlayedRef.current = true;
            playAnimation();
          }
        } else if (!entry.isIntersecting) {
          hasPlayedRef.current = false;
          stopAnimations();
        }
      },
      { threshold: 0.2 } 
    );

    loadObserver.observe(container);
    animObserver.observe(container);

    return () => {
      loadObserver.disconnect();
      animObserver.disconnect();
      if (loadCleanup) loadCleanup();
    };
  }, [containerRef, playAnimation, imagesReady, loadImages, stopAnimations]);

  useEffect(() => {
    const onResize = () => scheduleDraw(frameIndexRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [scheduleDraw]);

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      stopAnimations();
    };
  }, [stopAnimations]);

  const isDark = product.isDark ?? false;

  return (
    <div
      ref={containerRef as Ref<HTMLDivElement>}
      className="min-h-[100dvh] w-full relative overflow-hidden cursor-pointer"
      onClick={() => {
        hasPlayedRef.current = true;
        playAnimation();
      }}
      style={{ perspective: "1500px" }}
    >
      {/* Full screen canvas container */}
      <div className="absolute inset-0 z-0">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-contain z-0"
          aria-label={`${product.name} bottle animation`}
        />

        {!imagesReady && (
          <div
            className={`absolute inset-0 z-20 text-sm font-medium flex items-center justify-center gap-2 ${
              isDark ? "text-white/60" : "text-gray-500"
            }`}
          >
            <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            Loading experience…
          </div>
        )}
      </div>

      {/* TEXT OVERLAYS ON TOP */}
      <div className="relative z-20 w-full min-h-[100dvh] flex items-center justify-center pointer-events-none">
        <ProductTextOverlays
          product={product}
          progress={progress}
          isDark={isDark}
        />
      </div>
    </div>
  );
}
