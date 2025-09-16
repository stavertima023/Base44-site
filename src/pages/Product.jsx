
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CartService } from "@/components/mockData";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, MessageCircle, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import ProductImageModal from "@/components/ProductImageModal";

// A simple card component for the recommended products
const RecommendedProductCard = ({ product }) => (
  <Link
    to={`${createPageUrl("Product")}?id=${product.id}`}
    className="group"
  >
    <div className="aspect-square relative overflow-hidden mb-4 rounded-lg bg-gray-50">
      <img
        src={product.image_url}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
    </div>
    <div>
      <h3 className="font-semibold text-gray-900 mb-1 text-sm group-hover:text-red-600 transition-colors duration-200 truncate">
        {product.name}
      </h3>
      <span className="text-sm font-bold text-gray-900">
        ₽{(product.price).toFixed(2)}
      </span>
    </div>
  </Link>
);


export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const productId = new URLSearchParams(window.location.search).get('id');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`)
        if (!res.ok) throw new Error('Failed to load product')
        const p = await res.json()
        const mapped = {
          id: p.id,
          name: p.title,
          description: p.description,
          price: (p.price_cents || 0) / 100,
          image_url: Array.isArray(p.images) && p.images.length ? p.images[0] : null,
          images: Array.isArray(p.images) ? p.images : [],
          attributes: p.attributes || { sizes: ['XS','S','M','L','XL'] }
        }
        setProduct(mapped)
        setActiveImageIndex(0)
      } catch (error) {
        console.error("Error loading product:", error)
      }
      setIsLoading(false)
    }

    const loadRecommendedProducts = async () => {
      try {
        const res = await fetch('/api/products?sort=alpha')
        const rows = await res.json()
        const mapped = rows.slice(0, 10).map(p => ({
          id: p.id,
          name: p.title,
          price: (p.price_cents || 0) / 100,
          image_url: Array.isArray(p.images) && p.images.length ? p.images[0] : null,
        }))
        setRecommendedProducts(mapped)
      } catch (error) {
        console.error("Error loading recommended products:", error)
      }
    }

    if (productId) {
      loadProduct()
      loadRecommendedProducts()
    }
  }, [productId])

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await CartService.create({
        product_id: productId,
        size: selectedSize,
        quantity: quantity
      });
      alert('Товар добавлен в корзину!');
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
    setIsAddingToCart(false);
  };

  const handleTelegramBuy = () => {
    const message = `Здравствуйте! Хочу купить ${product.name} (Размер: ${selectedSize}, Количество: ${quantity})`;
    window.open(`https://t.me/mansionsell?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAskQuestion = () => {
    const message = `Здравствуйте! У меня есть вопрос по товару ${product.name}`;
    window.open(`https://t.me/mansionsell?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Посмотри на этот товар: ${product.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена!');
    }
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Product Images with thumbnails and arrows */}
          <div className="space-y-4">
            <div className="grid grid-cols-[64px,1fr] gap-4 items-start">
              {/* Thumbnails */}
              <div className="flex flex-col gap-3">
                {(product.images || []).slice(0, 2).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-square w-16 overflow-hidden rounded-md border ${activeImageIndex === idx ? 'border-red-600' : 'border-gray-200 hover:border-gray-300'}`}
                    aria-label={`Просмотреть фото ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main image with arrows */}
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[activeImageIndex] || product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover cursor-zoom-in transition-transform duration-500"
                    onClick={() => setIsImageModalOpen(true)}
                  />
                ) : product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover cursor-zoom-in transition-transform duration-500"
                    onClick={() => setIsImageModalOpen(true)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-400 text-6xl">👕</span>
                  </div>
                )}

                {/* Prev */}
                {product.images && product.images.length > 1 && (
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)}
                    className="group absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 text-gray-800 border border-gray-200 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                    aria-label="Предыдущее фото"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
                {/* Next */}
                {product.images && product.images.length > 1 && (
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % product.images.length)}
                    className="group absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 text-gray-800 border border-gray-200 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                    aria-label="Следующее фото"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-2xl font-bold text-gray-900">
                  ₽{(product.price).toFixed(2)}
                </span>
                {product.original_price && (
                  <span className="text-lg text-gray-500 line-through">
                    ₽{Math.round(product.original_price * 90)}
                  </span>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Size: {selectedSize}
              </label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите размер" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                  <SelectItem value="XXL">XXL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-0 focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="bg-black text-white px-8 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {isAddingToCart ? "Adding..." : "Add to cart"}
                </Button>
              </div>
            </div>

            {/* Buy with Telegram */}
            <Button
              onClick={handleTelegramBuy}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Buy with Telegram
            </Button>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAskQuestion}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Ask a question</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="pt-6 border-t border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Products */}
        <div className="border-t border-gray-200 pt-16 md:pt-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10 md:mb-12">
            RECOMMENDED FOR YOU
          </h2>
          <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 scrollbar-hide">
            {recommendedProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-36 sm:w-48">
                <RecommendedProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProductImageModal 
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={(product.images && product.images.length > 0) ? product.images[activeImageIndex] : product.image_url}
        productName={product.name}
      />
    </div>
  );
}
