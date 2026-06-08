"use client";

import React, { useRef, useEffect } from 'react';

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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay) return;

    // Fix React autoplay issue by explicitly setting muted and playsInline on the DOM node
    video.defaultMuted = true;
    video.muted = true;
    if (playsInline) {
      video.playsInline = true;
    }

    // Play the video and catch any autoplay restrictions
    video.play().catch((e) => console.log('Autoplay prevented:', e));
  }, [autoPlay, playsInline]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
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
        className="w-full h-full object-cover"
        // Hardware acceleration optimizations and scaling to hide watermarks
        style={{
          transform: 'scale(1.10) translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
}
