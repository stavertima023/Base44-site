
import React, { useState, useEffect } from "react";
// Fetch from API instead of mockData
import ProductGrid from "@/components/ProductGrid";

export default function NewPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState('alpha');

  useEffect(() => {
    loadProducts();
  }, [sort]);

  const loadProducts = async () => {
    try {
      const res = await fetch(`/api/products?category=new&sort=${sort}`)
      const rows = await res.json()
      const mapped = rows.map(p => ({
        id: p.id,
        name: p.title,
        price: (p.price_cents || 0) / 100,
        image_url: Array.isArray(p.images) && p.images.length ? p.images[0] : null,
        category: 'new'
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
        <div className="flex justify-end mb-4">
          <select value={sort} onChange={(e)=>setSort(e.target.value)} className="border px-3 py-2 rounded-md">
            <option value="alpha">По алфавиту</option>
            <option value="price_desc">Сначала дороже</option>
            <option value="price_asc">Сначала дешевле</option>
            <option value="popular">По популярности</option>
          </select>
        </div>
        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </div>
  );
}
