

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronDown, Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const brands = ["Nike", "Adidas", "Supreme", "Off-White", "Stone Island", "C.P. Company", "Moncler"];
  const categories = ["Худи", "Зип Худи", "Футболки", "Шорты", "Лонгсливы"];

  return (
    <div className="min-h-screen bg-white">
      {/* Бегущая строка */}
      <div className="bg-black text-white py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-sm font-medium mx-8">
            🔥 БЕСПЛАТНАЯ ДОСТАВКА ПРИ ЗАКАЗЕ ОТ 5000₽ 
          </span>
          <span className="text-sm font-medium mx-8">
            ⚡ НОВАЯ КОЛЛЕКЦИЯ УЖЕ В ПРОДАЖЕ
          </span>
          <span className="text-sm font-medium mx-8">
            💎 ЭКСКЛЮЗИВНЫЕ БРЕНДЫ ТОЛЬКО У НАС
          </span>
          <span className="text-sm font-medium mx-8">
            🚀 СКИДКИ ДО 30% НА ПОПУЛЯРНЫЕ МОДЕЛИ
          </span>
        </div>
      </div>

      {/* Хедер */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Логотип */}
            <Link to={createPageUrl("Catalog")} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black text-white rounded font-bold flex items-center justify-center text-sm">
                CC
              </div>
              <span className="text-xl font-bold text-black hidden sm:block">
                COLD CULTURE
              </span>
            </Link>

            {/* Навигация для десктопа */}
            <nav className="hidden md:flex items-center space-x-8">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-black font-medium">
                  <span>БРЕНДЫ</span>
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {brands.map((brand) => (
                    <DropdownMenuItem key={brand}>
                      <Link 
                        to={createPageUrl(`Catalog?brand=${encodeURIComponent(brand)}`)}
                        className="w-full"
                      >
                        {brand}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-black font-medium">
                  <span>ОДЕЖДА</span>
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category}>
                      <Link 
                        to={createPageUrl(`Catalog?category=${encodeURIComponent(category.toLowerCase().replace(/ /g, '_'))}`)}
                        className="w-full"
                      >
                        {category}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link 
                to={createPageUrl("About")} 
                className="text-gray-700 hover:text-black font-medium"
              >
                О НАС
              </Link>
            </nav>

            {/* Иконки справа */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingBag className="w-5 h-5" />
              </Button>
              
              {/* Мобильное меню */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Мобильная навигация */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">БРЕНДЫ</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {brands.map((brand) => (
                      <Link
                        key={brand}
                        to={createPageUrl(`Catalog?brand=${encodeURIComponent(brand)}`)}
                        className="text-gray-600 hover:text-black text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {brand}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">ОДЕЖДА</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Link
                        key={category}
                        to={createPageUrl(`Catalog?category=${encodeURIComponent(category.toLowerCase().replace(/ /g, '_'))}`)}
                        className="block text-gray-600 hover:text-black text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Основной контент */}
      <main>
        {children}
      </main>

      {/* Футер */}
      <footer className="bg-black text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">COLD CULTURE</h3>
              <p className="text-gray-400 text-sm">
                Эксклюзивная streetwear одежда от лучших мировых брендов
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">КАТЕГОРИИ</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link 
                    key={category}
                    to={createPageUrl(`Catalog?category=${encodeURIComponent(category.toLowerCase().replace(/ /g, '_'))}`)}
                    className="block text-gray-400 hover:text-white text-sm"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">БРЕНДЫ</h4>
              <div className="space-y-2">
                {brands.slice(0, 5).map((brand) => (
                  <Link 
                    key={brand}
                    to={createPageUrl(`Catalog?brand=${encodeURIComponent(brand)}`)}
                    className="block text-gray-400 hover:text-white text-sm"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">ИНФОРМАЦИЯ</h4>
              <div className="space-y-2">
                 <Link 
                    to={createPageUrl(`About`)}
                    className="block text-gray-400 hover:text-white text-sm"
                  >
                    О Нас
                  </Link>
                  <Link 
                    to={createPageUrl(`Import`)}
                    className="block text-gray-400 hover:text-white text-sm"
                  >
                    Импорт товаров (Админ)
                  </Link>
                  <Link 
                    to={createPageUrl(`DeployGuide`)}
                    className="block text-gray-400 hover:text-white text-sm"
                  >
                    🚀 Гайд по деплою
                  </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2024 Cold Culture. Все права защищены.
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

