"use client";

import React, { useRef, useEffect, useState } from 'react';

interface HeroSequenceCanvasProps {
  folderPath: string; // e.g., '/videos/sequences/hero-1'
  frameCount: number; // e.g., 120
  progress?: number; // 0 to 1, useful for scroll-trigger
  autoplay?: boolean;
  fps?: number;
  className?: string;
  onLoadComplete?: () => void;
}

export default function HeroSequenceCanvas({
  folderPath,
  frameCount,
  progress,
  autoplay = false,
  fps = 30,
  className = '',
  onLoadComplete,
}: HeroSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const currentFrameRef = useRef(0);
  const requestRef = useRef<number>();

  // Preload frames
  useEffect(() => {
    let loaded = 0;
    const loadedFramesArr: HTMLImageElement[] = new Array(frameCount);
    let isActive = true;

    const loadFrame = (i: number) => {
      if (!isActive) return;
      const img = new Image();
      img.src = `${folderPath}/${i}.webp`;
      img.decoding = 'async';
      
      img.onload = () => {
        if (!isActive) return;
        loaded++;
        setLoadedFrames(loaded);
        if (loaded === frameCount && onLoadComplete) {
          onLoadComplete();
        }
      };
      
      img.onerror = () => {
        if (!isActive) return;
        console.warn(`Failed to load frame ${i} from ${folderPath}`);
        loaded++;
        setLoadedFrames(loaded);
        if (loaded === frameCount && onLoadComplete) {
          onLoadComplete();
        }
      };
      
      loadedFramesArr[i - 1] = img;
    };

    // Use requestIdleCallback to prevent blocking the main thread during heavy preloading
    const enqueueLoad = (i: number) => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => loadFrame(i));
      } else {
        setTimeout(() => loadFrame(i), 0);
      }
    };

    for (let i = 1; i <= frameCount; i++) {
      enqueueLoad(i);
    }
    
    setFrames(loadedFramesArr);
    
    return () => {
      isActive = false;
      loadedFramesArr.forEach(img => { if (img) img.src = ''; });
    };
  }, [folderPath, frameCount, onLoadComplete]);

  // Drawing function
  const drawFrame = React.useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = frames[frameIndex];
    if (img && img.complete) {
      // Ensure canvas size matches image
      if (canvas.width !== img.width || canvas.height !== img.height) {
        canvas.width = img.width || 1920;
        canvas.height = img.height || 1080;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }, [frames]);

  // Handle Autoplay
  useEffect(() => {
    if (!autoplay || frames.length === 0) return;

    let lastTime = Date.now();
    const interval = 1000 / fps;

    const animate = () => {
      const now = Date.now();
      const delta = now - lastTime;

      if (delta > interval) {
        currentFrameRef.current = (currentFrameRef.current + 1) % frameCount;
        drawFrame(currentFrameRef.current);
        lastTime = now - (delta % interval);
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [autoplay, frames, fps, frameCount, drawFrame]);

  // Handle Progress (Scroll)
  useEffect(() => {
    if (progress !== undefined && frames.length > 0 && !autoplay) {
      const frameIndex = Math.min(
        frameCount - 1,
        Math.max(0, Math.floor(progress * frameCount))
      );
      
      // Avoid redrawing if the frame hasn't changed
      if (currentFrameRef.current !== frameIndex || frameIndex === 0) {
        currentFrameRef.current = frameIndex;
        requestRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
      }
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  }, [progress, frames, autoplay, frameCount, drawFrame]);

  // Draw initial frame if not autoplaying and no progress
  useEffect(() => {
    if (frames.length > 0 && !autoplay && progress === undefined) {
      requestRef.current = requestAnimationFrame(() => drawFrame(0));
    }
  }, [frames, autoplay, progress, drawFrame]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block"
      />
      {loadedFrames < frameCount && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10 transition-opacity duration-500">
          <div className="text-white flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="font-mono text-sm tracking-widest uppercase">
              Loading Sequence ({Math.round((loadedFrames / frameCount) * 100)}%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
