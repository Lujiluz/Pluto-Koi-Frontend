"use client";

import { useState } from "react";
import Image from "next/image";
import { BackendGallery } from "@/lib/types";
import { formatOwnerName, getTotalMediaCount } from "@/services/galleryService";
import { isVideoUrl } from "@/services/auctionService";
import { Folder, Star } from "react-feather";

interface GalleryCardProps {
  gallery: BackendGallery;
  className?: string;
  onClick?: (gallery: BackendGallery) => void;
  viewMode?: "grid" | "list";
}

export default function GalleryCard({ gallery, className = "", onClick, viewMode = "grid" }: GalleryCardProps) {
  const [mediaError, setMediaError] = useState(false);

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

  const renderMedia = (useContain: boolean = false) => {
    const objectFit = useContain ? "object-contain" : "object-cover";

    if (mediaError) {
      return <Image src="/images/koi/contoh_ikan.png" alt={gallery.galleryName} fill className={`${objectFit} transition-transform duration-500 group-hover:scale-105`} />;
    }

    if (isPreviewVideo) {
      return <video src={previewUrl} className={`w-full h-full ${objectFit} transition-transform duration-500 group-hover:scale-105`} muted loop playsInline onError={() => setMediaError(true)} />;
    } else {
      return <Image src={previewUrl} alt={gallery.galleryName} fill className={`${objectFit} transition-transform duration-500 group-hover:scale-105`} onError={() => setMediaError(true)} />;
    }
  };

  // List View Layout
  if (viewMode === "list") {
    return (
      <div className={`flex bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${className}`} onClick={handleCardClick}>
        {/* Media Preview - 3:2 aspect ratio */}
        <div className="relative w-48 md:w-64 flex-shrink-0 bg-gray-100" style={{ aspectRatio: "3/2" }}>
          {renderMedia(true)}

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

  // Grid View Layout (default) - Similar to ProductCard style
  return (
    <div className={`group overflow-hidden rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-shadow ${className}`} onClick={handleCardClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      {/* Media Container - 3:2 aspect ratio with object-contain */}
      <div className="relative w-full bg-gray-100 overflow-hidden" style={{ aspectRatio: "3/2" }}>
        {renderMedia(true)}

        {/* Gallery Type Badge - Exclusive */}
        {gallery.galleryType === "exclusive" && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1 z-10">
            <Star size={14} fill="white" />
            <span>Exclusive</span>
          </div>
        )}

        {/* Folder Tag */}
        {gallery.folderName && (
          <div className="absolute top-3 left-3 bg-primary/90 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
            <Folder size={14} />
            <span>{gallery.folderName}</span>
          </div>
        )}
      </div>

      {/* Content - Below image like ProductCard */}
      <div className="p-4 md:p-5">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{gallery.galleryName}</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-medium">Owner:</span> {formatOwnerName(gallery.owner)}
          </p>
          {gallery.fishType && (
            <p>
              <span className="font-medium">Jenis:</span> {gallery.fishType}
            </p>
          )}
          <p>
            <span className="font-medium">Handling:</span> {gallery.handling}
          </p>
        </div>
      </div>
    </div>
  );
}
