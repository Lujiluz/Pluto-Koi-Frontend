import Image from "next/image";
import LiquidGlassContainer from "../components/ui/LiquidGlassContainer";
import { ArrowRight } from "react-feather";
import { FishIcon, PeopleIcon, TrophyIcon } from "../components/icons/landingPage";
import AuctionSectionServer from "../components/sections/AuctionSectionServer";
import AuthRequiredSection from "../components/sections/AuthRequiredSection";
import GallerySection from "../components/sections/GallerySection";
import ProductsSection from "../components/sections/ProductsSection";
import Footer from "../components/layout/public/Footer";
import ClientAuthWrapper from "../components/ClientAuthWrapper";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center" id="beranda">
        {/* Background */}
        <Image src="/hero/hero-background.webp" alt="Koi Fish Background" fill className="object-cover object-center" priority />

        {/* Content */}
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 w-full items-center">
            {/* Hero Image */}
            <div className="hidden lg:block">
              <Image src="/hero/hero-complement.png" alt="Koi Fish Foreground" width={545} height={522} priority />
            </div>

            {/* Hero Text with Liquid Glass */}
          </div>
          <div className="absolute z-20 w-full top-[2rem] left-[8rem]">
            <LiquidGlassContainer variant="subtle" padding="lg" borderRadius="xl" className="max-w-3xl text-white">
              <h1 className="text-responsive-3xl font-bold mb-6 leading-tight">
                Temukan Keseruan Lelang
                <br />& Belanja Ikan Favoritmu!
              </h1>
              <p className="text-responsive-md opacity-90 mb-8 leading-relaxed">Ikut bid, belanja alat, atau lihat galeri hasil lelang kami.</p>
              <button className="btn-primary inline-flex items-center gap-2 text-responsive-base">
                Mulai Ikut Lelang
                <ArrowRight size={18} />
              </button>
            </LiquidGlassContainer>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-[#FFE6E630]" id="fitur">
        <div className="container-custom px-8 flex gap-28">
          {/* Section Header */}
          <div className="max-w-2/5 mb-16">
            <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
              Nikmati <span className="text-primary">3 Fitur</span> Utama Kami
            </h2>
            <p className="text-responsive-base text-gray-600 leading-relaxed">Mulai dari ikut lelang real-time, belanja perlengkapan memancing & ikan segar, hingga melihat galeri momen seru komunitas — semua ada di satu platform.*</p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-x-20 gap-y-14">
            {/* Feature 1 - Lelang Seru, Real-Time! */}
            <div className="w-3xs">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center  mb-9">
                <FishIcon />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Lelang Seru, Real-Time!</h3>
              <p className="text-gray-600 leading-relaxed">Ikuti bid secara langsung dengan countdown dan leaderboard, pastikan kamu jadi pemenangnya!</p>
            </div>

            {/* Feature 2 - Lihat Momen Seru */}
            <div className="w-3xs">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center  mb-9">
                <PeopleIcon />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Lihat Momen Seru*</h3>
              <p className="text-gray-600 leading-relaxed">Nikmati foto dan video dari event memancing serta hasil tangkapan terbaik komunitas kami.</p>
            </div>

            {/* Feature 3 - Belanja Ikan & Alat Pancing */}
            <div className="w-3xs col-span-2">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center  mb-9">
                <TrophyIcon />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Belanja Ikan & Alat Pancing</h3>
              <p className="text-gray-600 leading-relaxed">Temukan ikan segar dan perlengkapan memancing terbaik, siap kirim langsung ke rumahmu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Auction Section - Only show for authenticated users */}
      <ClientAuthWrapper />

      {/* Moments Section */}
      <GallerySection />

      {/* Products Section */}
      <ProductsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
