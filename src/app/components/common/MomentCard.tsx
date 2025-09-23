"use client";

import Image from "next/image";
import LiquidGlassContainer from "../ui/LiquidGlassContainer";
import { MomentData } from "@/app/data/moments";

interface MomentCardProps {
  moment: MomentData;
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function MomentCard({ moment, size = "medium", className = "" }: MomentCardProps) {
  const sizeClasses = {
    small: "h-48 md:h-56",
    medium: "h-56 md:h-64 lg:h-72",
    large: "h-64 md:h-80 lg:h-96",
  };

  return (
    <div className={`relative group overflow-hidden rounded-2xl ${sizeClasses[size]} ${className}`}>
      {/* Background Image */}
      <Image src={moment.image || "/images/placeholder-koi.jpg"} alt={moment.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

      {/* Quote/Watermark */}
      {/* <div className="absolute top-6 right-6 text-white/50 text-sm font-light italic hidden md:block">"Be the refuge TO HERE"</div> */}

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <LiquidGlassContainer variant="subtle" padding="md" borderRadius="lg" className="text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-semibold mb-3">{moment.title}</h3>
              <div className="space-y-1 text-sm md:text-base">
                <p className="opacity-90">
                  <span className="font-medium">Owner:</span> {moment.owner} - {moment.location}
                </p>
                <p className="opacity-90">
                  <span className="font-medium">Handling:</span> {moment.handling}
                </p>
              </div>
            </div>
          </div>
        </LiquidGlassContainer>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}
