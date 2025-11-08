"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

export interface NavigationProgressState {
  isNavigating: boolean;
  startNavigation: () => void;
  completeNavigation: () => void;
}

export function useNavigationProgress(): NavigationProgressState {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
  }, []);

  const completeNavigation = useCallback(() => {
    setIsNavigating(false);
  }, []);

  // Auto-complete navigation when pathname changes
  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, isNavigating]);

  // Cleanup on unmount
  useEffect(() => {
    return () => setIsNavigating(false);
  }, []);

  return {
    isNavigating,
    startNavigation,
    completeNavigation,
  };
}

// Global navigation progress state
let globalNavigationState = {
  isNavigating: false,
  listeners: new Set<(state: boolean) => void>(),
};

export function startGlobalNavigation() {
  globalNavigationState.isNavigating = true;
  globalNavigationState.listeners.forEach((listener) => listener(true));
}

export function completeGlobalNavigation() {
  globalNavigationState.isNavigating = false;
  globalNavigationState.listeners.forEach((listener) => listener(false));
}

export function subscribeToGlobalNavigation(listener: (state: boolean) => void) {
  globalNavigationState.listeners.add(listener);
  return () => {
    globalNavigationState.listeners.delete(listener);
  };
}
