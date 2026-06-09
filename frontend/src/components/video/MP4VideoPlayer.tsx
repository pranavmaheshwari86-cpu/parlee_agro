"use client";

import React, { useRef, useEffect, useState } from 'react';

interface MP4VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  playsInline?: boolean;
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
}: MP4VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          if (autoPlay && videoRef.current) {
            videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
            setIsPlaying(true);
          }
        } else {
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { rootMargin: '300px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [autoPlay]);

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
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={shouldLoad ? src : undefined}
        poster={poster}
        loop={loop}
        muted={muted}
        controls={controls}
        playsInline={playsInline}
        preload="none"
        className="w-full h-full object-cover transition-transform duration-300"
        style={{
          backfaceVisibility: 'hidden',
          willChange: isPlaying ? 'transform' : 'auto',
        }}
      />
    </div>
  );
}
