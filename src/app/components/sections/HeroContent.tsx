"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Zap } from "react-feather";
import LiquidGlassContainer from "../ui/LiquidGlassContainer";

interface TypewriterTextProps {
  text: string;
  delay?: number;
  startDelay?: number;
  className?: string;
  onComplete?: () => void;
  isStarted: boolean;
  highlightText?: string;
  highlightClassName?: string;
}

const TypewriterText = ({ text, delay = 30, startDelay = 0, className = "", onComplete, isStarted, highlightText, highlightClassName = "text-white font-medium" }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isStarted) return;

    const startTimeout = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;

      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          onComplete?.();
        }
      }, delay);

      return () => clearInterval(typeInterval);
    }, startDelay);

    return () => clearTimeout(startTimeout);
  }, [isStarted, text, delay, startDelay, onComplete]);

  // Render with highlight if needed
  const renderText = () => {
    if (!highlightText || !displayedText.includes(highlightText.slice(0, displayedText.length))) {
      return displayedText;
    }

    const highlightStart = text.indexOf(highlightText);
    const highlightEnd = highlightStart + highlightText.length;

    if (displayedText.length <= highlightStart) {
      return displayedText;
    }

    const beforeHighlight = displayedText.slice(0, highlightStart);
    const highlightedPart = displayedText.slice(highlightStart, Math.min(displayedText.length, highlightEnd));
    const afterHighlight = displayedText.length > highlightEnd ? displayedText.slice(highlightEnd) : "";

    return (
      <>
        {beforeHighlight}
        <span className={highlightClassName}>{highlightedPart}</span>
        {afterHighlight}
      </>
    );
  };

  return (
    <span className={className}>
      {renderText()}
      {isTyping && <span className="animate-pulse">|</span>}
    </span>
  );
};

export default function HeroContent() {
  const [isInView, setIsInView] = useState(false);
  const [titleComplete, setTitleComplete] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const titleText = "Pluto Koi Centre";
  const descriptionText = "Temukan koleksi Koi berkualitas premium dan ikuti lelang real-time bersama komunitas pecinta Koi terbesar.";

  return (
    <div ref={heroRef} className="container-custom relative z-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      <LiquidGlassContainer variant="subtle" padding="lg" borderRadius="xl" className="max-w-full lg:max-w-6xl xl:max-w-7xl text-white">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-10">
          {/* Mascot Image inside container */}
          <div className="relative flex-shrink-0 w-[120px] sm:w-[160px] lg:w-[200px]">
            <div className="hero-image-container">
              <Image src="/hero/sharpened_mascot_2 1.png" alt="Pluto Koi Mascot" width={200} height={200} className="hero-floating-image drop-shadow-2xl w-full h-auto" priority />
            </div>
            {/* Glow effect behind image */}
            <div className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-gradient-to-br from-primary/60 via-orange-400/40 to-yellow-300/30 rounded-full scale-75 animate-pulse-slow" />
          </div>

          {/* Text content */}
          <div className="text-center sm:text-left flex-1">
            {/* Badge with shimmer effect */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-2 sm:px-3 py-1 mb-2 sm:mb-4 overflow-hidden relative badge-shimmer">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-[8px] sm:text-[10px] lg:text-xs text-white/90 font-medium">Shiro Utsuri Specialist</span>
            </div>

            <h1 className="text-lg sm:text-2xl lg:text-4xl xl:text-5xl font-bold mb-1.5 sm:mb-3 leading-tight min-h-[1.2em]">
              <TypewriterText text={titleText} delay={80} isStarted={isInView} onComplete={() => setTitleComplete(true)} />
            </h1>

            <p className="text-[10px] sm:text-xs lg:text-base text-white/80 mb-3 sm:mb-6 leading-relaxed max-w-md min-h-[2.5em] sm:min-h-[3em]">
              <TypewriterText text={descriptionText} delay={20} startDelay={200} isStarted={titleComplete} highlightText="Koi berkualitas premium" highlightClassName="text-white font-medium" />
            </p>

            {/* Quick Action Buttons Banner */}
            <div className={`flex flex-row gap-2 sm:gap-3 lg:gap-4 transition-all duration-500 ${titleComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <Link href="/lelang" className="group flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-2 sm:p-3 lg:p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between gap-1.5 sm:gap-2 lg:gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Zap size={12} className="sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-[10px] sm:text-xs lg:text-base font-semibold text-white">Lelang Ikan</h3>
                      <p className="text-[8px] sm:text-[10px] lg:text-xs text-white/80 hidden sm:block">Mulai bid sekarang</p>
                    </div>
                  </div>
                  <ArrowRight size={10} className="sm:w-3.5 sm:h-3.5 lg:w-[18px] lg:h-[18px] text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link href="/belanja" className="group flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-2 sm:p-3 lg:p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between gap-1.5 sm:gap-2 lg:gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ShoppingBag size={12} className="sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-[10px] sm:text-xs lg:text-base font-semibold text-white">Belanja</h3>
                      <p className="text-[8px] sm:text-[10px] lg:text-xs text-white/80 hidden sm:block">Alat & ikan segar</p>
                    </div>
                  </div>
                  <ArrowRight size={10} className="sm:w-3.5 sm:h-3.5 lg:w-[18px] lg:h-[18px] text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </LiquidGlassContainer>
    </div>
  );
}
