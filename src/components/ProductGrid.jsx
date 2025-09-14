
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductGrid({ products, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-600">
          Check back soon for new arrivals
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`${createPageUrl("Product")}?id=${product.id}`}
          className="group"
        >
          <div className="aspect-square relative overflow-hidden mb-4 md:rounded-lg md:bg-gray-50">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-4xl">👕</span>
              </div>
            )}
            {(product.category === "sale" || product.original_price) && (
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                SALE
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-gray-900 mb-1 text-base group-hover:text-red-600 transition-colors duration-200">
              {product.name}
            </h3>
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="text-base font-bold text-gray-900">
                ₽{(product.price).toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-sm text-gray-500 line-through">
                  ₽{(product.original_price).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
