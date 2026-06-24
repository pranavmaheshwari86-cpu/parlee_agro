"use client";

import { useEffect, useState, useRef } from 'react';
import { useVideoPreloadStore } from '@/store/useVideoPreloadStore';
import { products } from '@/data/products';

export default function VideoPreloaderManager() {
  const { visibleIndex, states, setPreloadState } = useVideoPreloadStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const loadingRef = useRef<boolean>(false);

  useEffect(() => {
    // If we are currently loading a video, wait for it to finish
    if (loadingRef.current) return;

    let targetIndex = currentIndex;
    
    // Prioritize the visible video if the user jumps to it and it's not loaded
    if (visibleIndex !== null && states[visibleIndex] !== 'loaded' && states[visibleIndex] !== 'preloading') {
       targetIndex = visibleIndex;
    } else {
       // Otherwise, find the next unloaded video in sequence
       let found = false;
       for (let i = 0; i < products.length; i++) {
         const idx = (currentIndex + i) % products.length;
         const p = products[idx];
         if (p.videoType === 'mp4' && p.videoSrc && states[idx] !== 'loaded' && states[idx] !== 'preloading') {
           targetIndex = idx;
           found = true;
           break;
         }
       }
       // If all videos are loaded, we are done
       if (!found) return;
    }

    const product = products[targetIndex];
    
    // Skip if it's not an mp4 or missing src
    if (product.videoType !== 'mp4' || !product.videoSrc) {
       setPreloadState(targetIndex, 'loaded'); 
       setCurrentIndex((targetIndex + 1) % products.length);
       return;
    }

    // Lock and start loading
    loadingRef.current = true;
    setPreloadState(targetIndex, 'preloading');

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = product.videoSrc;

    const onComplete = () => {
      loadingRef.current = false;
      setPreloadState(targetIndex, 'loaded');
      setCurrentIndex((targetIndex + 1) % products.length);
    };

    link.onload = onComplete;
    link.onerror = onComplete;

    document.head.appendChild(link);
    
  }, [currentIndex, visibleIndex, states, setPreloadState]);

  return null;
}
