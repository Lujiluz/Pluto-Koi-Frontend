"use client";

import { useRef, useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Award, Heart, Users, Calendar } from "react-feather";
import Footer from "@/app/components/layout/public/Footer";
import { cn } from "@/lib/utils";

// Activity images data
const ACTIVITY_IMAGES = [
  {
    id: 1,
    src: "/images/about/20231104_101318.jpg",
    alt: "Kegiatan lelang koi Pluto Koi",
    caption: "Momen Lelang Koi",
  },
  {
    id: 2,
    src: "/images/about/IMG_20231029_163640.jpg",
    alt: "Perawatan kolam koi",
    caption: "Perawatan Premium",
  },
  {
    id: 3,
    src: "/images/about/20251104_135902.jpg",
    alt: "Event koi show",
    caption: "Koi Show Event",
  },
  {
    id: 4,
    src: "/images/about/20251113_171826.jpg",
    alt: "Perawatan kolam koi",
    caption: "Perawatan Premium",
  },
  {
    id: 5,
    src: "/images/about/20251031_150921.jpg",
    alt: "Komunitas pecinta koi",
    caption: "Komunitas Koi",
  },
  {
    id: 6,
    src: "/images/about/20251031_103938.jpg",
    alt: "Pengunjung melihat koleksi koi",
    caption: "Kunjungan Pelanggan",
  },
];

// Stats data
const STATS = [
  { icon: Calendar, value: "10+", label: "Tahun Pengalaman", color: "text-primary" },
  { icon: Heart, value: "200+", label: "Pelanggan Puas", color: "text-red-500" },
  { icon: Award, value: "100+", label: "Koi Berkualitas", color: "text-yellow-500" },
  { icon: Users, value: "50+", label: "Event Lelang", color: "text-blue-500" },
];

// Memoized carousel item for performance
const CarouselItem = memo(function CarouselItem({ image, isActive, priority }: { image: (typeof ACTIVITY_IMAGES)[0]; isActive: boolean; priority: boolean }) {
  return (
    <div className={cn("flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-2 sm:px-3 transition-opacity duration-300", isActive ? "opacity-100" : "opacity-70")}>
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white font-medium text-sm sm:text-base">{image.caption}</p>
        </div>
      </div>
    </div>
  );
});

// Stat card component
const StatCard = memo(function StatCard({ stat, index }: { stat: (typeof STATS)[0]; index: number }) {
  const IconComponent = stat.icon;
  return (
    <div className="flex flex-col items-center p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: `${index * 100}ms` }}>
      <div className={cn("mb-2 sm:mb-3", stat.color)}>
        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
      </div>
      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{stat.value}</span>
      <span className="text-xs sm:text-sm text-gray-600 text-center mt-1">{stat.label}</span>
    </div>
  );
});

export default function AboutPageClient() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Calculate visible items based on screen size
  const getVisibleItems = useCallback(() => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }, []);

  const [visibleItems, setVisibleItems] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setVisibleItems(getVisibleItems());
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getVisibleItems]);

  const maxIndex = Math.max(0, ACTIVITY_IMAGES.length - visibleItems);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setIsAutoPlaying(false);
  }, [maxIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setIsAutoPlaying(false);
  }, [maxIndex]);

  // Touch handlers for mobile swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        {/* Animated background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float-gentle" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full animate-breathe" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particle particle-1" />
          <div className="particle particle-2" />
          <div className="particle particle-3" />
          <div className="particle particle-4" />
          <div className="particle particle-5" />
        </div>

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            <span className="inline-block animate-fade-in-up">Tentang</span> <span className="inline-block text-primary animate-fade-in-up animation-delay-200 relative">Pluto Koi</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
            Lebih dari 10 tahun berdedikasi dalam menghadirkan ikan koi berkualitas terbaik untuk para pecinta koi di Indonesia
          </p>

          {/* Decorative line */}
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-width-expand" />
          </div>
        </div>

        {/* Decorative bottom wave with animation */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 -1 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto animate-wave-gentle" preserveAspectRatio="none">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* History Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image src="/images/LOGO PLUTO-01.png" alt="Pluto Koi Centre" fill className="object-contain bg-gray-100 p-8" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">Sejak 2014</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Sejarah <span className="text-primary">Pluto Koi Centre</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-justify">
                <p>
                  <strong className="text-gray-900">Pluto Koi Centre</strong> is a premium koi farm dedicated to the art, science, and passion of high-quality Nishikigoi.
                </p>
                <p>
                  Founded by Yudha D Kandi, the visionary founder and driving force behind Pluto Koi Centre. With deep expertise in koi farm and a lifelong passion for ornamental fish, Yudha has established himself as one of Indonesia’s
                  most respected koi specialists
                </p>
                <p>Over the years, Pluto Koi has built a remarkable reputation in the koi community — particularly for exceptional work with the Shiro Utsuri variety and numerous awards and trophies.</p>
                <p>Based in Tangerang Selatan, Indonesia, Pluto Koi Centre operates under carefully controlled water quality, nutrition, and biosecurity systems to ensure every koi grows in an optimal environment.</p>
                <p>Pluto Koi is also a proud member of the Japan Nishikigoi Association, connecting us directly with global breeders, standards, and innovations in Nishikigoi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Pencapaian Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Angka-angka yang menjadi bukti dedikasi kami dalam dunia koi</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Activity Carousel Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Momen <span className="text-primary">Kegiatan</span> Kami
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Dokumentasi berbagai kegiatan dan event yang telah kami selenggarakan bersama komunitas pecinta koi</p>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Navigation Buttons - Desktop */}
            <button
              onClick={handlePrev}
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 w-10 h-10 lg:w-12 lg:h-12 items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 w-10 h-10 lg:w-12 lg:h-12 items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
            </button>

            {/* Carousel Track */}
            <div ref={carouselRef} className="overflow-hidden mx-0 sm:mx-8 lg:mx-10" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
                }}
              >
                {ACTIVITY_IMAGES.map((image, index) => (
                  <CarouselItem key={image.id} image={image} isActive={index >= currentIndex && index < currentIndex + visibleItems} priority={index < 3} />
                ))}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex sm:hidden justify-center gap-4 mt-6">
              <button onClick={handlePrev} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200" aria-label="Previous slide">
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button onClick={handleNext} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200" aria-label="Next slide">
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={cn("w-2 h-2 rounded-full transition-all duration-300", currentIndex === index ? "bg-primary w-6" : "bg-gray-300 hover:bg-gray-400")}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={currentIndex === index ? "true" : "false"}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
        {/* Animated background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-gentle" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-primary/5 to-transparent rounded-full animate-breathe" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particle particle-1" />
          <div className="particle particle-3" />
          <div className="particle particle-5" />
        </div>

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Nilai-Nilai <span className="text-primary">Kami</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Prinsip yang menjadi fondasi dalam setiap langkah kami</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Value Card 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sm:p-8 hover:bg-white/10 transition-colors duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Kualitas Premium</h3>
              <p className="text-gray-400 text-sm sm:text-base">Kami hanya menghadirkan ikan koi shiro utsuri dengan kualitas terbaik, dipilih dengan cermat untuk memenuhi standar tertinggi.</p>
            </div>

            {/* Value Card 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sm:p-8 hover:bg-white/10 transition-colors duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Passion & Dedikasi</h3>
              <p className="text-gray-400 text-sm sm:text-base">Setiap koi yang kami rawat adalah hasil dari cinta dan dedikasi yang tidak pernah pudar selama lebih dari 10 tahun.</p>
            </div>

            {/* Value Card 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sm:p-8 hover:bg-white/10 transition-colors duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Komunitas Solid</h3>
              <p className="text-gray-400 text-sm sm:text-base">Kami membangun komunitas yang solid untuk berbagi pengetahuan dan pengalaman inklusif dalam dunia koi shiro utsuri.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
