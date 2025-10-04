"use client";

import ProductCard from "../common/ProductCard";
import { mockProductsData, productsSection } from "@/app/data/products";

export default function ProductsSection() {
  return (
    <section className="section-padding bg-white" id="belanja">
      <div className="container-custom px-8 flex flex-col">
        {/* Section Header */}
        <div className="mb-12 flex md:flex-row flex-col justify-between">
          <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
            <span className="text-primary">Peralatan</span> & Ikan Terbaik
          </h2>
          <p className="text-responsive-base text-gray-800 leading-relaxed max-w-2xl">{productsSection.subtitle}</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {mockProductsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
