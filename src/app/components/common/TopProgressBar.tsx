"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToGlobalNavigation, completeGlobalNavigation } from "@/hooks/useNavigationProgress";

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(0);
  const isNavigatingGlobally = useRef<boolean>(false);

  const startProgress = useCallback(() => {
    if (isLoading) return; // Prevent multiple starts

    setIsLoading(true);
    setProgress(0);
    startTime.current = Date.now();

    // Smooth progress using requestAnimationFrame for 60fps updates
    let currentProgress = 0;
    let animationId: number;

    const smoothIncrement = () => {
      const elapsed = Date.now() - startTime.current;
      const targetProgress = Math.min(
        95,
        // Smooth exponential curve: fast start, gradual slowdown
        95 * (1 - Math.exp(-elapsed / 800))
      );

      // Smooth interpolation towards target
      const diff = targetProgress - currentProgress;
      currentProgress += diff * 0.1; // Smooth interpolation factor

      setProgress(currentProgress);

      // Stop if taking too long (fallback)
      if (elapsed > 8000) {
        currentProgress = 100;
        setProgress(100);
        completeProgress();
        return;
      }

      // Continue if not complete and still navigating
      if (currentProgress < 94 && isNavigatingGlobally.current) {
        animationId = requestAnimationFrame(smoothIncrement);
      }
    };

    // Start immediately with requestAnimationFrame for smooth 60fps
    animationId = requestAnimationFrame(smoothIncrement);

    // Store animationId for cleanup
    progressInterval.current = animationId as any;
  }, [isLoading]);

  const completeProgress = useCallback(() => {
    if (progressInterval.current) {
      if (typeof progressInterval.current === "number") {
        cancelAnimationFrame(progressInterval.current);
      } else {
        clearTimeout(progressInterval.current);
      }
      progressInterval.current = null;
    }

    isNavigatingGlobally.current = false;

    // Smooth completion animation
    setProgress(100);

    setTimeout(() => {
      setIsLoading(false);
      // Reset progress with a slight delay for smooth fade
      setTimeout(() => setProgress(0), 250);
    }, 200);

    // Signal that global navigation is complete
    completeGlobalNavigation();
  }, []);

  // Listen to global navigation state
  useEffect(() => {
    const unsubscribe = subscribeToGlobalNavigation((isNavigating) => {
      if (isNavigating) {
        isNavigatingGlobally.current = true;
        startProgress();
      }
    });

    return unsubscribe;
  }, [startProgress]);

  // Complete progress when route changes
  useEffect(() => {
    if (isNavigatingGlobally.current) {
      // Small delay to ensure page is actually loading
      const completeTimer = setTimeout(completeProgress, 300 + Math.random() * 200);
      return () => clearTimeout(completeTimer);
    }
  }, [pathname, searchParams, completeProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        if (typeof progressInterval.current === "number") {
          cancelAnimationFrame(progressInterval.current);
        } else {
          clearTimeout(progressInterval.current);
        }
        progressInterval.current = null;
      }
      isNavigatingGlobally.current = false;
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0 }}
          transition={{
            duration: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94], // Smooth easing curve
          }}
          className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent pointer-events-none"
          style={{
            transformOrigin: "top",
            willChange: "transform, opacity",
          }}
        >
          {/* Background track */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200/20 via-slate-300/30 to-slate-200/20" />

          {/* Progress bar */}
          <motion.div
            className="h-full relative overflow-hidden"
            animate={{ width: `${progress}%` }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 40,
              mass: 1,
              restDelta: 0.01,
            }}
            style={{
              willChange: "width",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Main gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-900" />

            {/* Animated shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "easeInOut",
              }}
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                willChange: "transform",
              }}
            />

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-700/50 via-slate-500/70 to-slate-700/50 blur-[1px]" />
          </motion.div>

          {/* Subtle pulse at the end */}
          <motion.div
            className="absolute top-0 h-full w-2 bg-gradient-to-r from-slate-400 to-slate-600 shadow-lg shadow-slate-500/50"
            animate={{
              left: `${progress}%`,
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.1, 1],
            }}
            transition={{
              left: {
                type: "spring",
                stiffness: 400,
                damping: 40,
                mass: 1,
              },
              opacity: {
                repeat: Infinity,
                duration: 0.8,
                ease: "easeInOut",
              },
              scale: {
                repeat: Infinity,
                duration: 0.8,
                ease: "easeInOut",
              },
            }}
            style={{
              willChange: "transform, opacity",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
