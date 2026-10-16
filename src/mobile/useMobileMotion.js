// src/mobile/useMobileMotion.js
import { useState, useEffect, useCallback } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export function useMobileMotion() {
  const [motionMode, setMotionModeState] = useState(() => {
    try {
      return localStorage.getItem('ssp_motion_mode') || 'auto';
    } catch {
      return 'auto';
    }
  });

  const [isPaused, setIsPaused] = useState(false);

  // Sync mode changes to body class
  const setMotionMode = useCallback((mode) => {
    setMotionModeState(mode);
    try {
      localStorage.setItem('ssp_motion_mode', mode);
    } catch (e) {
      console.warn('Failed to save motion mode:', e);
    }
  }, []);

  // Update DOM classes for reduced motion or paused motion
  useEffect(() => {
    const root = document.documentElement;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldReduce = motionMode === 'reduced' || (motionMode === 'auto' && prefersReduced);

    if (shouldReduce) {
      root.classList.add('reduced-effects-mode');
    } else {
      root.classList.remove('reduced-effects-mode');
    }

    if (isPaused) {
      root.classList.add('motion-paused');
    } else {
      root.classList.remove('motion-paused');
    }
  }, [motionMode, isPaused]);

  // Handle browser tab visibility change
  useEffect(() => {
    const handleVisibility = () => {
      setIsPaused(document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Handle native Capacitor app background / foreground events
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let appListenerHandle = null;
    const setupListener = async () => {
      try {
        appListenerHandle = await App.addListener('appStateChange', (state) => {
          setIsPaused(!state.isActive);
        });
      } catch (err) {
        console.warn('Capacitor App listener error:', err);
      }
    };
    setupListener();

    return () => {
      if (appListenerHandle && appListenerHandle.remove) {
        appListenerHandle.remove();
      }
    };
  }, []);

  // Safe Haptic feedback trigger
  const triggerHaptic = useCallback(async (style = 'light') => {
    try {
      if (Capacitor.isNativePlatform()) {
        const impactStyle = style === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light;
        await Haptics.impact({ style: impactStyle });
      } else if (navigator.vibrate) {
        navigator.vibrate(style === 'medium' ? 18 : 8);
      }
    } catch {
      // Non-critical, ignore silent failures
    }
  }, []);

  return {
    motionMode,
    setMotionMode,
    isPaused,
    triggerHaptic
  };
}
