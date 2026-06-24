"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useVideoPreloadStore } from '@/store/useVideoPreloadStore';

interface MP4VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  index?: number;
}

export default function MP4VideoPlayer({
  src,
  poster,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  playsInline = true,
  index,
}: MP4VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  
  const setVisibleIndex = useVideoPreloadStore((state) => state.setVisibleIndex);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          if (index !== undefined) {
            setVisibleIndex(index);
          }
          // Only play if it was already loaded, otherwise let autoPlay handle it, or use a separate effect
          if (videoRef.current && videoRef.current.src) {
             videoRef.current.play().catch(e => console.log('Play prevented:', e));
             setIsPlaying(true);
          }
        } else {
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { rootMargin: '1000px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [index, setVisibleIndex]);

  useEffect(() => {
    if (shouldLoad && autoPlay && videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log('Autoplay prevented:', e));
    }
  }, [shouldLoad, autoPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    if (playsInline) {
      video.playsInline = true;
    }
  }, [shouldLoad, playsInline]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-black ${className}`}>
      {shouldLoad && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline={playsInline}
          preload="auto"
          onCanPlay={() => setIsVideoReady(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backfaceVisibility: 'hidden',
            willChange: isPlaying ? 'transform' : 'auto',
          }}
        />
      )}
      {poster && (!shouldLoad || !isVideoReady) && (
        <Image src={poster} alt="" fill className="object-cover" unoptimized={true} priority={index === 0} />
      )}
    </div>
  );
}
