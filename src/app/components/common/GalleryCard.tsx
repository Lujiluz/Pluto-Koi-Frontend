"use client";

import { useState } from "react";
import Image from "next/image";
import { BackendGallery } from "@/lib/types";
import { formatOwnerName, getTotalMediaCount } from "@/services/galleryService";
import { isVideoUrl } from "@/services/auctionService";
import LiquidGlassContainer from "../ui/LiquidGlassContainer";
import { Folder, Star } from "react-feather";

interface GalleryCardProps {
  gallery: BackendGallery;
  size?: "small" | "medium" | "large";
  className?: string;
  onClick?: (gallery: BackendGallery) => void;
  viewMode?: "grid" | "list";
}

export default function GalleryCard({ gallery, size = "medium", className = "", onClick, viewMode = "grid" }: GalleryCardProps) {
  const [mediaError, setMediaError] = useState(false);

  const sizeClasses = {
    small: "h-48 md:h-56",
    medium: "h-56 md:h-64 lg:h-72",
    large: "h-64 md:h-80 lg:h-96",
  };

  const getPreviewMedia = () => {
    if (!gallery.media || gallery.media.length === 0) {
      return {
        url: "/images/koi/contoh_ikan.png",
        isVideo: false,
      };
    }

    const firstMedia = gallery.media[0];
    return {
      url: firstMedia.fileUrl,
      isVideo: isVideoUrl(firstMedia.fileUrl),
    };
  };

  const { url: previewUrl, isVideo: isPreviewVideo } = getPreviewMedia();

  const handleCardClick = () => {
    if (onClick) {
      onClick(gallery);
    }
  };

  const renderMedia = () => {
    if (mediaError) {
      return <Image src="/images/koi/contoh_ikan.png" alt={gallery.galleryName} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />;
    }

    if (isPreviewVideo) {
      return <video src={previewUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" muted autoPlay loop playsInline onError={() => setMediaError(true)} />;
    } else {
      return <Image src={previewUrl} alt={gallery.galleryName} fill className="object-cover transition-transform duration-500 group-hover:scale-110" onError={() => setMediaError(true)} />;
    }
  };

  // List View Layout
  if (viewMode === "list") {
    return (
      <div className={`flex bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${className}`} onClick={handleCardClick}>
        {/* Media Preview */}
        <div className="relative w-48 h-36 md:w-64 md:h-44 flex-shrink-0">
          {renderMedia()}

          {/* Gallery Type Badge */}
          {gallery.galleryType === "exclusive" && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <Star size={12} fill="white" />
              <span>Exclusive</span>
            </div>
          )}

          {/* Folder Tag */}
          {gallery.folderName && (
            <div className="absolute bottom-2 left-2 bg-primary/90 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <Folder size={12} />
              <span>{gallery.folderName}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-6 flex flex-col justify-center">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{gallery.galleryName}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Owner:</span> {formatOwnerName(gallery.owner)}
            </p>
            {gallery.fishType && (
              <p>
                <span className="font-medium">Jenis:</span> {gallery.fishType}
              </p>
            )}
            {gallery.fishCode && (
              <p>
                <span className="font-medium">Kode:</span> {gallery.fishCode}
              </p>
            )}
            <p>
              <span className="font-medium">Handling:</span> {gallery.handling}
            </p>
            <p>
              <span className="font-medium">Media:</span> {getTotalMediaCount(gallery)} file
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Layout (default)
  return (
    <div className={`relative group overflow-hidden rounded-2xl ${sizeClasses[size]} ${className}`} onClick={handleCardClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      {/* Background Media */}
      {renderMedia()}

      {/* Gallery Type Badge - Exclusive */}
      {gallery.galleryType === "exclusive" && (
        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1 z-10">
          <Star size={14} fill="white" />
          <span>Exclusive</span>
        </div>
      )}

      {/* Folder Tag */}
      {gallery.folderName && (
        <div className="absolute top-4 left-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
          <Folder size={14} />
          <span>{gallery.folderName}</span>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <LiquidGlassContainer variant="subtle" padding="md" borderRadius="lg" className="text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-semibold mb-3">{gallery.galleryName}</h3>
              <div className="space-y-1 text-sm md:text-base">
                <p className="opacity-90">
                  <span className="font-medium">Owner:</span> {formatOwnerName(gallery.owner)}
                </p>
                {gallery.fishType && (
                  <p className="opacity-90">
                    <span className="font-medium">Jenis:</span> {gallery.fishType}
                  </p>
                )}
                <p className="opacity-90">
                  <span className="font-medium">Handling:</span> {gallery.handling}
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
