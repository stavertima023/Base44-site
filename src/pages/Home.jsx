
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const categories = [
    {
      name: "New Arrivals",
      category: "new",
      icon: "🆕",
      url: createPageUrl("New"),
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/da9bda531_Revenge-Your-Love-Tee-Black-02.jpeg?quality=100&width=500"
    },
    {
      name: "Tees",
      category: "tees",
      icon: "👕",
      url: createPageUrl("Shirts"),
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/902d7d645_Worldwide-Tee-BlackBlue-01.jpeg?quality=100&width=500"
    },
    {
      name: "Hoodies",
      category: "hoodies",
      icon: "🧥",
      url: createPageUrl("Hoodie"),
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/657b5cb95_Cream-Sage-Hoodie-01.jpeg?quality=100&width=500"
    },
    {
      name: "Bottoms",
      category: "bottoms",
      icon: "👖",
      url: createPageUrl("Bottoms"),
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/fbf1d0db5_Multi-Denim-Flare-01.jpeg?quality=100&width=500"
    },
    {
      name: "Women",
      category: "woman",
      icon: "👗",
      url: createPageUrl("Womens"),
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/15c8c6633_GloGirl-Lavender-Top.jpeg?quality=100&width=500"
    }
  ];

  const bannerImages = [
    "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/25b809fd5_8B6A5940.jpg?quality=100&width=1920",
    "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/4bb71aa15_8B6A5935.jpg?quality=100&width=1920",
    "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/300672fa6_8B6A6417.jpg?quality=100&width=1920"
  ];

  return (
    <div>
      {/* Hero Banner - full width, high quality, with overlay text and button */}
      <section className="relative overflow-hidden">
        <Link to={createPageUrl("New")} className="block cursor-pointer" aria-label="Hero New Arrivals">
          <picture>
            <source
              srcSet="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/4f7034733_8B6A6386.jpg?quality=100&width=3840"
              media="(min-width: 1920px)"
            />
            <source
              srcSet="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/4f7034733_8B6A6386.jpg?quality=100&width=2560"
              media="(min-width: 1280px)"
            />
            <source
              srcSet="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/4f7034733_8B6A6386.jpg?quality=100&width=1920"
              media="(min-width: 768px)"
            />
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/4f7034733_8B6A6386.jpg?quality=100&width=1280"
              alt="Hero"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto select-none"
            />
          </picture>
          {/* Overlay gradient and texts */}
          <div className="pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <div className="text-slate-50 mb-4 text-sm font-semibold tracking-wide">
                Our latest arrival
              </div>
              <h1 className="text-3xl md:text-3xl font-black text-white mb-6">
                Glo Up
              </h1>
              <div className="inline-block text-white font-semibold underline decoration-white/60 decoration-2">
                Shop now
              </div>
            </div>
          </div>
        </Link>
      </section>
      
      {/* Shop by Category */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-2xl font-black text-gray-900 mb-4">
              SHOP BY CATEGORY
            </h2>
            <div className="bg-slate-50 mx-auto w-24 h-1" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link key={index} to={category.url} className="group">
                <div className="aspect-square relative overflow-hidden w-full">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 md:p-4 text-center">
                  <h3 className="font-bold text-sm md:text-base text-gray-900 group-hover:text-red-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Images */}
      <section className="py-0">
        <div className="w-full">
          {/* First banner: full width, natural height, highest quality external asset */}
          <picture>
            <source srcSet="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/25b809fd5_8B6A5940.jpg?quality=100&width=3840" media="(min-width: 1920px)" />
            <source srcSet="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/25b809fd5_8B6A5940.jpg?quality=100&width=2560" media="(min-width: 1280px)" />
            <source srcSet="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/25b809fd5_8B6A5940.jpg?quality=100&width=1920" media="(min-width: 768px)" />
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/25b809fd5_8B6A5940.jpg?quality=100&width=1280"
              alt="GLO GANG Banner 1"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto"
            />
          </picture>
        </div>
      </section>

      {/* Email Subscription Section */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/c0f4a61cc_favicon_277573ab-785b-46ee-9d23-893add5cd20b.png"
              alt="GLO GANG"
              className="h-20 w-20 mx-auto"
            />
          </div>

          <h2 className="text-gray-900 mb-4 text-xs font-black md:text-3xl tracking-wide">
            SIGN UP FOR UPDATES AND JOIN THE GLO CONVERSATION.
          </h2>

          <p className="text-gray-500 text-sm mb-8 tracking-wide">
            RECEIVE 15% OFF.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-none text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
            />
            <button className="bg-red-600 text-white px-8 py-3 rounded-none font-semibold hover:bg-red-700 transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
