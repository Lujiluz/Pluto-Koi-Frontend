import Image from "next/image";
import { FishIcon, PeopleIcon, TrophyIcon } from "../components/icons/landingPage";
import GallerySection from "../components/sections/GallerySection";
import HeroContent from "../components/sections/HeroContent";
import Footer from "../components/layout/public/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex items-center justify-center" id="beranda">
        {/* Background */}
        <Image src="/hero/hero-background.webp" alt="Koi Fish Background" fill className="object-cover object-center" priority />

        {/* Content */}
        <HeroContent />
      </section>

      {/* Features Section */}
      <section className="section-padding bg-[#FFE6E630]" id="fitur">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:gap-28">
            {/* Section Header */}
            <div className="w-full lg:max-w-2/5 mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-black mb-4 sm:mb-6 leading-tight">
                Nikmati <span className="text-primary">3 Fitur</span> Utama Kami
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Mulai dari ikut lelang real-time, belanja perlengkapan memancing & ikan segar, hingga melihat galeri momen seru komunitas — semua ada di satu platform.*</p>
            </div>

            {/* Features Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8 md:gap-x-12 md:gap-y-10 lg:gap-x-20 lg:gap-y-14">
              {/* Feature 1 - Lelang Seru, Real-Time! */}
              <div className="w-full">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mb-6 sm:mb-9">
                  <FishIcon />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">Lelang Seru, Real-Time!</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Ikuti bid secara langsung dengan countdown dan leaderboard, pastikan kamu jadi pemenangnya!</p>
              </div>

              {/* Feature 2 - Lihat Momen Seru */}
              <div className="w-full">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mb-6 sm:mb-9">
                  <PeopleIcon />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">Lihat Momen Seru*</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Nikmati foto dan video dari event memancing serta hasil tangkapan terbaik komunitas kami.</p>
              </div>

              {/* Feature 3 - Belanja Ikan & Alat Pancing */}
              <div className="w-full md:col-span-2 lg:col-span-1 xl:col-span-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mb-6 sm:mb-9">
                  <TrophyIcon />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">Belanja Ikan & Alat Pancing</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Temukan ikan segar dan perlengkapan memancing terbaik, siap kirim langsung ke rumahmu.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moments Section */}
      <GallerySection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
