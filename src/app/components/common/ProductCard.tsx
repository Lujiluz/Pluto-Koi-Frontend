"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductData } from "@/app/data/products";
import { BackendProduct } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { formatProductPrice, getPreviewMediaUrl } from "@/services/productService";
import { isVideoUrl } from "@/services/auctionService";

interface ProductCardProps {
  product: ProductData | BackendProduct;
  className?: string;
}

// Type guard to check if product is from backend
const isBackendProduct = (product: ProductData | BackendProduct): product is BackendProduct => {
  return "_id" in product;
};

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const [mediaError, setMediaError] = useState(false);

  // Normalize product data based on type
  const normalizedProduct = isBackendProduct(product)
    ? {
        id: product._id,
        name: product.productName,
        price: product.productPrice,
        image: getPreviewMediaUrl(product),
        isVideo: product.media && product.media.length > 0 ? isVideoUrl(product.media[0].fileUrl) : false,
      }
    : {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        isVideo: false,
      };

  const handleBuyClick = () => {
    // No action on click as requested
    console.log(`Buy clicked for ${normalizedProduct.name}`);
  };

  const formatPriceDisplay = (price: number) => {
    return isBackendProduct(product) ? formatProductPrice(price) : formatCurrency(price);
  };

  const renderMedia = () => {
    if (mediaError) {
      return <Image src="/images/products/produk_koi.png" alt={normalizedProduct.name} fill className="object-cover" />;
    }

    if (normalizedProduct.isVideo) {
      return <video src={normalizedProduct.image} className="w-full h-full object-cover" muted autoPlay loop playsInline onError={() => setMediaError(true)} />;
    } else {
      return <Image src={normalizedProduct.image} alt={normalizedProduct.name} fill className="object-cover" onError={() => setMediaError(true)} />;
    }
  };

  return (
    <div className="card-hover overflow-hidden">
      {/* Product Image */}
      <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">{renderMedia()}</div>

      {/* Product Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 duration-300">{normalizedProduct.name}</h3>

        <p className="text-2xl font-bold text-primary mb-6">{formatPriceDisplay(normalizedProduct.price)}</p>

        {/* Buy Button */}
        <button onClick={handleBuyClick} className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
          Beli
        </button>
      </div>
    </div>
  );
}
