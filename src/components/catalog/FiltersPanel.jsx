import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

export default function FiltersPanel({ 
  brands, 
  categories, 
  selectedBrands, 
  selectedCategories, 
  priceRange, 
  onBrandChange, 
  onCategoryChange, 
  onPriceChange 
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Фильтры</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Бренды */}
        <div>
          <h3 className="font-semibold mb-3">Бренды</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={(checked) => onBrandChange(brand, checked)}
                />
                <label className="text-sm cursor-pointer">{brand}</label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Категории */}
        <div>
          <h3 className="font-semibold mb-3">Категории</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedCategories.includes(category.value)}
                  onCheckedChange={(checked) => onCategoryChange(category.value, checked)}
                />
                <label className="text-sm cursor-pointer">{category.label}</label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Диапазон цен */}
        <div>
          <h3 className="font-semibold mb-3">Цена</h3>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={onPriceChange}
              max={50000}
              min={0}
              step={500}
              className="mb-3"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{priceRange[0].toLocaleString()}₽</span>
              <span>{priceRange[1].toLocaleString()}₽</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}