import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Основное изображение */}
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[currentImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-500 font-medium">{product.name}</span>
            </div>
          )}

          {/* Бейджи */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_featured && (
              <Badge className="bg-red-500 text-white">
                ХИТ
              </Badge>
            )}
            {hasDiscount && (
              <Badge className="bg-green-500 text-white">
                -{discountPercent}%
              </Badge>
            )}
            {product.stock_quantity === 0 && (
              <Badge variant="outline" className="bg-white/90">
                Нет в наличии
              </Badge>
            )}
          </div>

          {/* Кнопки действий */}
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button variant="outline" size="icon" className="bg-white/90 hover:bg-white">
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          {/* Превью дополнительных изображений */}
          {product.images && product.images.length > 1 && (
            <div className={`absolute bottom-3 left-3 flex gap-1 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              {product.images.slice(0, 4).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="mb-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              {product.brand}
            </p>
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
              {product.name}
            </h3>
          </div>

          {/* Размеры */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.sizes.slice(0, 4).map((size, index) => (
                <span 
                  key={index}
                  className="text-xs border border-gray-200 px-2 py-1 rounded"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-xs text-gray-500">+{product.sizes.length - 4}</span>
              )}
            </div>
          )}

          {/* Цена */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {product.price.toLocaleString()}₽
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {product.original_price.toLocaleString()}₽
                </span>
              )}
            </div>
          </div>

          {/* Кнопка добавления в корзину */}
          <Button 
            className="w-full mt-4 bg-black hover:bg-gray-800 text-white"
            disabled={product.stock_quantity === 0}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {product.stock_quantity === 0 ? "Нет в наличии" : "В корзину"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}