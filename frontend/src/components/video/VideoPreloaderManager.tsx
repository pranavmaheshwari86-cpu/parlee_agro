"use client";

import { useEffect, useState } from 'react';
import { useVideoPreloadStore } from '@/store/useVideoPreloadStore';
import { products } from '@/data/products';

// Helper to check network speed
const isSlowNetwork = () => {
  if (typeof window !== 'undefined' && 'connection' in navigator) {
    const conn = (navigator as any).connection;
    if (conn.saveData) return true;
    if (['slow-2g', '2g', '3g'].includes(conn.effectiveType)) return true;
  }
  return false;
};

export default function VideoPreloaderManager() {
  const { visibleIndex, states, setPreloadState } = useVideoPreloadStore();
  const [preloadUrls, setPreloadUrls] = useState<string[]>([]);

  useEffect(() => {
    if (visibleIndex === null) return;
    
    // Calculate which videos to preload
    const preloadCount = isSlowNetwork() ? 1 : 2; // Throttle on slow networks
    const newUrls: string[] = [];
    
    for (let i = 1; i <= preloadCount; i++) {
      const targetIndex = visibleIndex + i;
      if (targetIndex >= products.length) continue;
      
      const product = products[targetIndex];
      // Only preload mp4 videos as per requirements
      if (product.videoType !== 'mp4' || !product.videoSrc) continue;
      
      const state = states[targetIndex];
      if (state === 'preloading' || state === 'loaded') continue;
      
      // Start preloading
      setPreloadState(targetIndex, 'preloading');
      newUrls.push(product.videoSrc);
      
      // We will create the links dynamically, but we also want to track when they finish
      // to update the state to "loaded". We can do this with standard DOM elements.
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = product.videoSrc;
      
      link.onload = () => setPreloadState(targetIndex, 'loaded');
      link.onerror = () => setPreloadState(targetIndex, 'not_loaded');
      
      document.head.appendChild(link);
    }
    
    if (newUrls.length > 0) {
      setPreloadUrls(prev => [...prev, ...newUrls]);
    }
  }, [visibleIndex, states, setPreloadState]);

  // We don't need to render anything visually. The DOM elements appended to head do the work.
  // Next.js 14 ReactDOM.preload is also an option but appending link manually gives us onload/onerror control.
  return null;
}
