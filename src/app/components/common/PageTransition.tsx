"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    y: -20,
  },
};

const overlayVariants: Variants = {
  initial: {
    opacity: 0,
    background: "linear-gradient(45deg, rgba(30, 41, 59, 0) 0%, rgba(51, 65, 85, 0) 100%)",
  },
  animate: {
    opacity: [1, 0],
    background: ["linear-gradient(45deg, rgba(30, 41, 59, 0.1) 0%, rgba(51, 65, 85, 0.05) 100%)", "linear-gradient(45deg, rgba(30, 41, 59, 0) 0%, rgba(51, 65, 85, 0) 100%)"],
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="relative overflow-hidden" style={{ isolation: "isolate" }}>
      <AnimatePresence mode="wait" onExitComplete={() => setIsTransitioning(false)}>
        <motion.div
          key={pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth feel
          }}
          className="relative z-10"
          style={{
            willChange: "transform, opacity", // Optimize for animations
            backfaceVisibility: "hidden", // Prevent flickering
            transform: "translateZ(0)", // Force hardware acceleration
          }}
          onAnimationStart={() => setIsTransitioning(true)}
          onAnimationComplete={() => setIsTransitioning(false)}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Subtle overlay animation for depth */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-[5] pointer-events-none"
            style={{
              mixBlendMode: "multiply",
              willChange: "opacity",
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating particles effect during transition */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" style={{ willChange: "opacity" }}>
            {/* Subtle floating elements */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-slate-300/20 rounded-full"
                initial={{
                  x: `${20 + i * 30}%`,
                  y: "120%",
                  scale: 0,
                }}
                animate={{
                  y: "-20%",
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                style={{ willChange: "transform, opacity" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
