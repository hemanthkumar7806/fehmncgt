/**
 * Polyfill for useEffectEvent (useEvent) to fix compatibility issues
 * with Next.js 15 and React 19
 * 
 * This polyfill ensures useEffectEvent is available before the SDK tries to use it
 */
import React from 'react';
import { useRef, useInsertionEffect, useCallback } from 'react';

// Polyfill useEffectEvent if it's not available
if (typeof window !== 'undefined' && !(React as any).useEffectEvent) {
  (React as any).useEffectEvent = function useEvent<T extends (...args: any[]) => any>(fn: T): T {
    const ref = useRef<T>(null as any);
    
    useInsertionEffect(() => {
      ref.current = fn;
    }, [fn]);
    
    return useCallback((...args: Parameters<T>) => {
      const f = ref.current;
      return f(...args);
    }, []) as T;
  };
}

// Also export it for direct use if needed
export function useEvent<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef<T>(null as any);
  
  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);
  
  return useCallback((...args: Parameters<T>) => {
    const f = ref.current;
    return f(...args);
  }, []) as T;
}
