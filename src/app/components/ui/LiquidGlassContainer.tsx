"use client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  as?: "div" | "section" | "article" | "main";
  variant?: "default" | "liquid-glass" | "subtle";
  borderRadius?: "sm" | "md" | "lg" | "xl";
}

const LiquidGlassContainer = ({ children, className, size = "xl", padding = "md", as: Component = "div", variant = "default", borderRadius = "lg" }: ContainerProps) => {
  const sizeClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    full: "w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-12",
  };

  const borderRadiusClasses = {
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
  };

  const variantClasses = {
    default: "bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg",
    subtle: "bg-white/5 backdrop-blur-sm border border-white/10 shadow-md",
    "liquid-glass": cn(
      // Base glass effect
      "bg-black/20 backdrop-blur-sm border border-white/20",
      // David UI Liquid Glass shadows
      "shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)]",
      // Positioning for pseudo-elements
      "relative",
      // Top gradient (before pseudo-element)
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none",
      // Bottom gradient (after pseudo-element)
      "after:absolute after:inset-0 after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none"
    ),
  };

  const baseClasses = cn("mx-auto w-full", sizeClasses[size], paddingClasses[padding], borderRadiusClasses[borderRadius], variantClasses[variant], className);

  // Add border radius to pseudo-elements for liquid-glass variant
  const liquidGlassStyles =
    variant === "liquid-glass"
      ? {
          style: {
            // This ensures the pseudo-elements inherit the border radius
            "--border-radius": borderRadiusClasses[borderRadius].replace("rounded", "").replace("-", "") || "0.5rem",
          } as React.CSSProperties,
        }
      : {};

  return (
    <Component className={baseClasses} {...liquidGlassStyles}>
      {variant === "liquid-glass" ? <div className="relative z-10">{children}</div> : children}
    </Component>
  );
};

export default LiquidGlassContainer;
