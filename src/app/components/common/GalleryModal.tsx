"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, User, MapPin, Calendar, Play, Download } from "react-feather";
import { BackendGallery } from "@/lib/types";
import { formatOwnerName } from "@/services/galleryService";
import { isVideoUrl } from "@/services/auctionService";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  gallery: BackendGallery | null;
}

export default function GalleryModal({ isOpen, onClose, gallery }: GalleryModalProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaError, setMediaError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && gallery) {
      setCurrentMediaIndex(0);
      setMediaError(false);
    }
  }, [isOpen, gallery]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleKeyNavigation = (e: KeyboardEvent) => {
      if (!isOpen || !gallery) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevMedia();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextMedia();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("keydown", handleKeyNavigation);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleKeyNavigation);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, gallery, currentMediaIndex]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const nextMedia = () => {
    if (gallery && currentMediaIndex < gallery.media.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
      setMediaError(false);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
      setMediaError(false);
    }
  };

  const handleMediaClick = (index: number) => {
    setCurrentMediaIndex(index);
    setMediaError(false);
  };

  const renderCurrentMedia = () => {
    if (!gallery || !gallery.media || gallery.media.length === 0) {
      return (
        <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
          <p className="text-gray-500">Tidak ada media tersedia</p>
        </div>
      );
    }

    const currentMedia = gallery.media[currentMediaIndex];
    const isVideo = isVideoUrl(currentMedia.fileUrl);

    if (mediaError) {
      return (
        <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
          <p className="text-gray-500">Gagal memuat media</p>
        </div>
      );
    }

    if (isVideo) {
      return (
        <video
          src={currentMedia.fileUrl}
          className="w-full h-96 object-contain rounded-lg"
          controls
          muted
          onError={() => setMediaError(true)}
          key={currentMedia._id} // Force re-render when media changes
        />
      );
    } else {
      return (
        <div className="relative w-full h-96 rounded-lg overflow-hidden">
          <Image src={currentMedia.fileUrl} alt={`${gallery.galleryName} - Media ${currentMediaIndex + 1}`} fill className="object-contain" onError={() => setMediaError(true)} />
        </div>
      );
    }
  };

  if (!isOpen || !gallery) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div ref={modalRef} className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto no-scrollbar" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-black">{gallery.galleryName}</h2>
            <div className="flex items-center space-x-4 text-gray-600 mt-2">
              <div className="flex items-center space-x-1">
                <User size={16} />
                <span>{formatOwnerName(gallery.owner)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin size={16} />
                <span>{gallery.handling}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>
                  {new Date(gallery.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Media Display */}
          <div className="relative mb-6">
            {renderCurrentMedia()}

            {/* Navigation Arrows */}
            {gallery.media.length > 1 && (
              <>
                <button
                  onClick={prevMedia}
                  disabled={currentMediaIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/70"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextMedia}
                  disabled={currentMediaIndex === gallery.media.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/70"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Media Type Indicator */}
            {gallery.media[currentMediaIndex] && isVideoUrl(gallery.media[currentMediaIndex].fileUrl) && (
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg flex items-center space-x-1">
                <Play size={16} />
                <span>Video</span>
              </div>
            )}

            {/* Media Counter */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg">
              {currentMediaIndex + 1} / {gallery.media.length}
            </div>

            {/* Download Button */}
            <a
              href={gallery.media[currentMediaIndex]?.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-full hover:bg-primary-600 transition-colors"
              title="Unduh media"
            >
              <Download size={16} />
            </a>
          </div>

          {/* Media Thumbnails */}
          {gallery.media.length > 1 && (
            <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 mb-6">
              {gallery.media.map((media, index) => {
                const isVideo = isVideoUrl(media.fileUrl);
                return (
                  <button
                    key={media._id}
                    onClick={() => handleMediaClick(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === currentMediaIndex ? "border-primary shadow-lg" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    {isVideo ? (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Play size={16} className="text-gray-500" />
                      </div>
                    ) : (
                      <Image src={media.fileUrl} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Gallery Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Informasi Galeri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Total Media:</p>
                <p className="font-medium">{gallery.media.length} file</p>
              </div>
              <div>
                <p className="text-gray-600">Status:</p>
                <p className={`font-medium ${gallery.isActive ? "text-green-600" : "text-red-600"}`}>{gallery.isActive ? "Aktif" : "Tidak Aktif"}</p>
              </div>
              <div>
                <p className="text-gray-600">Dibuat:</p>
                <p className="font-medium">
                  {new Date(gallery.createdAt).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Terakhir Diperbarui:</p>
                <p className="font-medium">
                  {new Date(gallery.updatedAt).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
