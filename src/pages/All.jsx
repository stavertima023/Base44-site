
import React, { useState, useEffect } from "react";
import { ProductService } from "../components/mockData";
import ProductGrid from "../components/ProductGrid";

export default function AllPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await ProductService.list("-created_date", 50);
      setProducts(data);
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
