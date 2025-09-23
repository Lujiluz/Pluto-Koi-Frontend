"use client";

import Image from "next/image";
import { ProductData } from "@/app/data/products";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: ProductData;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const handleBuyClick = () => {
    // No action on click as requested
    console.log(`Buy clicked for ${product.name}`);
  };

  return (
    <div className="card-hover overflow-hidden">
      {/* Product Image */}
      <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
      </div>

      {/* Product Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 duration-300">{product.name}</h3>

        <p className="text-2xl font-bold text-primary mb-6">{formatCurrency(product.price)}</p>

        {/* Buy Button */}
        <button onClick={handleBuyClick} className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
          Beli
        </button>
      </div>
    </div>
  );
}
