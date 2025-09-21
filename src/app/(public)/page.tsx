import Image from "next/image";
import LiquidGlassContainer from "../components/ui/LiquidGlassContainer";
import { ArrowRight } from "react-feather";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
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

      {/* Demo Section - Different Variants */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container-custom">
          <h2 className="text-responsive-2xl font-bold text-center mb-12">Liquid Glass Components Demo</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Default Variant */}
            <LiquidGlassContainer variant="default" padding="lg" className="text-center">
              <h3 className="text-xl font-semibold mb-3">Default Glass</h3>
              <p className="text-sm opacity-80 mb-4">Subtle glass effect with light background blur.</p>
              <button className="btn-primary">Learn More</button>
            </LiquidGlassContainer>

            {/* Subtle Variant */}
            <LiquidGlassContainer variant="subtle" padding="lg" className="text-center">
              <h3 className="text-xl font-semibold mb-3">Subtle Glass</h3>
              <p className="text-sm opacity-80 mb-4">Very light glass effect for minimal designs.</p>
              <button className="btn-secondary">Learn More</button>
            </LiquidGlassContainer>

            {/* Liquid Glass Variant */}
            <LiquidGlassContainer variant="liquid-glass" padding="lg" className="text-center text-white">
              <h3 className="text-xl font-semibold mb-3">Liquid Glass</h3>
              <p className="text-sm opacity-90 mb-4">Premium liquid glass effect with David UI styling.</p>
              <button className="btn-liquid-glass">Learn More</button>
            </LiquidGlassContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
