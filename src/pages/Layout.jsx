

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { CartService } from "@/components/mockData";
import SearchModal from "@/components/SearchModal";
import CartSidebar from "@/components/CartSidebar";
import MobileNav from "@/components/MobileNav";

const navigationItems = [
  { name: "All", url: createPageUrl("All") },
  { name: "New", url: createPageUrl("New") },
  { name: "Shirts", url: createPageUrl("Shirts") },
  { name: "Hoodies", url: createPageUrl("Hoodie") },
  { name: "Bottoms", url: createPageUrl("Bottoms") },
  { name: "Womens", url: createPageUrl("Womens") },
  { name: "Sale", url: "/sale" },
];


export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    loadCartCount();
    const onCartUpdated = () => loadCartCount();
    window.addEventListener('cart-updated', onCartUpdated);
    return () => window.removeEventListener('cart-updated', onCartUpdated);
  }, []);

  const loadCartCount = async () => {
    try {
      const cartItems = await CartService.list();
      setCartItemsCount(cartItems.length);
    } catch (error) {
      console.error("Error loading cart count:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="relative z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0 w-full">
          <div className="grid grid-cols-3 items-center h-36 w-full">
            {/* Mobile Menu Toggle (Left) */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2"
              >
                <Menu className="h-6 w-6 text-gray-800" />
              </button>
            </div>

            {/* Logo */}
            <div className="col-span-1 flex justify-start pl-4">
              <Link to={createPageUrl("Home")} className="flex items-center">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/88498d954_Red-Logo.png"
                  alt="GLO GANG"
                  className="h-28 w-auto hover:opacity-80 transition-opacity duration-200"
                />
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex col-span-1 items-center justify-center space-x-10 relative z-50 pointer-events-auto">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  className={`text-base md:text-lg font-semibold transition-colors duration-200 ${
                    location.pathname === item.url
                      ? "text-red-600"
                      : "text-gray-900 hover:text-red-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="col-span-1 flex items-center justify-end space-x-5 sm:space-x-7 pr-4 sm:pr-6 lg:pr-8 z-10">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Search className="h-5 w-5 text-gray-700" />
              </button>
              <Link to="/register" className="hidden sm:block p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <User className="h-5 w-5 text-gray-700" />
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative"
              >
                <ShoppingBag className="h-5 w-5 text-gray-700" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Sidebar */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationItems={navigationItems}
      />

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <Link to={createPageUrl("Home")}>
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/18335531f_Black-Logo.png"
                  alt="GLO GANG"
                  className="h-32 w-auto" />
              </Link>
            </div>
            <div className="md:col-span-8 grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-gray-900 text-sm font-semibold uppercase tracking-wider">INFORMATION</h3>
                <ul className="mt-4 space-y-3">
                  <li><Link to="/contact-us" className="text-gray-600 hover:text-gray-900 transition-colors">Contact Us</Link></li>
                  <li><Link to="/shipping-policy" className="text-gray-600 hover:text-gray-900 transition-colors">Shipping & Delivery</Link></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Returns / Exchanges</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Search</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-gray-900 text-sm font-semibold uppercase tracking-wider">LEGAL</h3>
                <ul className="mt-4 space-y-3">
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Refund Policy</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 py-8 text-center">
            <p className="text-gray-600 text-base">© 2025 GLOGANG WORLDWIDE. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => {
          setIsCartOpen(false);
          loadCartCount();
        }}
      />
    </div>
  );
}

