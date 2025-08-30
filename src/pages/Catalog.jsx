
import React, { useState, useEffect } from "react";
import { Product } from "@/api/entities";
import { ChevronDown, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";

import ProductCard from "../components/catalog/ProductCard";
// Removed FeaturedSection import
// import FeaturedSection from "../components/catalog/FeaturedSection"; // This line is removed
import FiltersPanel from "../components/catalog/FiltersPanel";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();

  const brands = ["Nike", "Adidas", "Supreme", "Off-White", "Stone Island", "C.P. Company", "Moncler"];
  const categories = [
    { value: "худи", label: "Худи" },
    { value: "зип_худи", label: "Зип Худи" },
    { value: "футболки", label: "Футболки" },
    { value: "шорты", label: "Шорты" },
    { value: "лонгсливы", label: "Лонгсливы" }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Фильтрация товаров
    let filtered = products;

    if (selectedBrand !== "all") {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Сортировка
    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    setFilteredProducts(filtered);
  }, [products, selectedBrand, selectedCategory, searchQuery, sortBy]);

  useEffect(() => {
    // URL параметры для фильтрации
    const urlParams = new URLSearchParams(location.search);
    const brandParam = urlParams.get('brand');
    const categoryParam = urlParams.get('category');

    setSelectedBrand(brandParam || "all");
    setSelectedCategory(categoryParam || "all");
  }, [location.search]);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await Product.list();
    setProducts(data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero секция */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            STREETWEAR
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Эксклюзивная коллекция от мировых брендов
          </p>
          <div className="max-w-md mx-auto relative">
            <Input
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white text-black"
            />
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Рекомендуемые товары section removed */}

      {/* Фильтры и каталог товаров */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
                <span className="font-medium">
                  {selectedBrand === "all" ? "Все бренды" : selectedBrand}
                </span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedBrand("all")}>
                  Все бренды
                </DropdownMenuItem>
                {brands.map((brand) => (
                  <DropdownMenuItem key={brand} onClick={() => setSelectedBrand(brand)}>
                    {brand}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
                <span className="font-medium">
                  {selectedCategory === "all" ? "Все категории" :
                   categories.find(c => c.value === selectedCategory)?.label || selectedCategory}
                </span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                  Все категории
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem key={category.value} onClick={() => setSelectedCategory(category.value)}>
                    {category.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
              <span className="text-sm">
                {sortBy === "featured" && "По популярности"}
                {sortBy === "price_low" && "Цена: по возрастанию"}
                {sortBy === "price_high" && "Цена: по убыванию"}
                {sortBy === "name" && "По названию"}
              </span>
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("featured")}>
                По популярности
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price_low")}>
                Цена: по возрастанию
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price_high")}>
                Цена: по убыванию
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name")}>
                По названию
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Каталог товаров */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500 text-lg">Товары не найдены</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedBrand("all");
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
              >
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
