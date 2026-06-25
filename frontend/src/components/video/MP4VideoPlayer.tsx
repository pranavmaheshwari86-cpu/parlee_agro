"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

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
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          // Play the video when it comes into view
          if (videoRef.current && videoRef.current.src) {
             videoRef.current.play().catch(e => console.log('Play prevented:', e));
             setIsPlaying(true);
          }
        } else {
          // Pause the video when it leaves the view
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { rootMargin: '200px' }
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
          preload="none"
          onCanPlay={() => setIsVideoReady(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backfaceVisibility: 'hidden',
            willChange: isPlaying ? 'transform' : undefined,
          }}
        />
      )}
      {poster && (!shouldLoad || !isVideoReady) && (
        <Image src={poster} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" quality={80} className="object-cover" priority={index === 0} />
      )}
    </div>
  );
}
