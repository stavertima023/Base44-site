
import React, { useState, useEffect } from "react";
import { CartService, mockProducts } from "./mockData";
import { X, Minus, Plus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartSidebar({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCartItems();
    }
    const onCartUpdated = () => {
      if (isOpen) loadCartItems();
    };
    window.addEventListener('cart-updated', onCartUpdated);
    return () => window.removeEventListener('cart-updated', onCartUpdated);
  }, [isOpen]);

  const loadCartItems = async () => {
    setIsLoading(true);
    try {
      const items = await CartService.list();
      setCartItems(items);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
    setIsLoading(false);
  };

  const updateQuantity = async (cartItem, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await CartService.update(cartItem.id, { ...cartItem, quantity: newQuantity });
      loadCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeFromCart = async (cartItem) => {
    try {
      await CartService.delete(cartItem.id);
      loadCartItems();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const handleTelegramCheckout = () => {
    const itemsList = cartItems.map(item => {
      const product = mockProducts.find(p => p.id === item.product_id);
      const name = product?.name || item.title || 'Товар';
      const qty = item.quantity || 1;
      const size = item.size ? ` (${item.size})` : '';
      return `${name}${size} x${qty}`;
    }).join('\n');

    const message = `Здравствуйте! Хочу оформить заказ:\n\n${itemsList}`;
    window.open(`https://t.me/mansionsell?text=${encodeURIComponent(message)}`, '_blank');
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const product = mockProducts.find(p => p.id === item.product_id);
    const unitPriceRub = (item.price_rub != null ? item.price_rub : product?.price) || 0;
    return sum + unitPriceRub * item.quantity;
  }, 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Корзина</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Корзина пуста
                </h3>
                <p className="text-gray-600">
                  Добавьте товары, чтобы начать покупки
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => {
                  const product = mockProducts.find(p => p.id === item.product_id);
                  const displayName = product?.name || item.title || 'Товар';
                  const displayImage = product?.image_url || item.image_url || null;
                  const unitPriceRub = (item.price_rub != null ? item.price_rub : product?.price) || 0;

                  return (
                    <div key={item.id} className="flex space-x-4 border-b pb-6">
                      <div className="w-20 h-20 relative overflow-hidden rounded-lg bg-gray-100">
                        {displayImage ? (
                          <img
                            src={displayImage}
                            alt={displayName}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-gray-400 text-2xl">👕</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {displayName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Размер: {item.size}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">₽{Math.round(unitPriceRub * item.quantity)}</p>
                            <button
                              onClick={() => removeFromCart(item)}
                              className="text-xs text-red-600 hover:text-red-800 transition-colors"
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Итого:</span>
                <span>₽{Math.round(totalPrice)}</span>
              </div>
              <Button
                onClick={handleTelegramCheckout}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Оформить заказ в Telegram</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
