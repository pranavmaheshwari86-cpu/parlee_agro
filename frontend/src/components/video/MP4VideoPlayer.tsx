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
      { rootMargin: '400px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
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
          preload="none"
          className="w-full h-full object-cover transition-transform duration-300"
          style={{
            backfaceVisibility: 'hidden',
            willChange: isPlaying ? 'transform' : 'auto',
          }}
        />
      )}
      {!shouldLoad && poster && (
        <img src={poster} alt="" className="w-full h-full object-cover" />
      )}
    </div>
  );
}
