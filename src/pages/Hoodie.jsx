
import React, { useState, useEffect } from "react";
// Fetch from API instead of mockData
import ProductGrid from "@/components/ProductGrid";

export default function HoodiePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products?category=hoodies')
      const rows = await res.json()
      const mapped = rows.map(p => ({
        id: p.id,
        name: p.title,
        price: (p.price_cents || 0) / 100,
        image_url: Array.isArray(p.images) && p.images.length ? p.images[0] : null,
        category: 'hoodies'
      }))
      setProducts(mapped)
    } catch (error) {
      console.error("Error loading products:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </div>
  );
}
