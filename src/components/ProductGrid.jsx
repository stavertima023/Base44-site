
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import useScrollReveal from "@/hooks/useScrollReveal";

function GridItem({ product, index }) {
  return (
    <div
      className="reveal"
      style={{ '--reveal-delay': `${Math.min(index, 20) * 60}ms` }}
    >
      <Link
        to={`${createPageUrl("Product")}?id=${product.id}`}
        className="group"
      >
        <div className="aspect-square relative overflow-hidden mb-4 md:rounded-lg md:bg-gray-50">
          {(() => {
            const primary = (product.images && product.images[0]) || product.image_url
            const secondary = product.images && product.images[1]
            if (!primary) {
              return (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">👕</span>
                </div>
              )
            }
            return (
              <>
                <img
                  src={primary}
                  alt={product.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${secondary ? 'opacity-100 group-hover:opacity-0' : 'group-hover:scale-110'}`}
                />
                {secondary && (
                  <img
                    src={secondary}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                )}
              </>
            )
          })()}
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
    </div>
  )
}

export default function ProductGrid({ products, isLoading }) {
  // initialize global intersection observer for `.reveal` elements
  useScrollReveal()
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
      {products.map((product, index) => (
        <GridItem key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
