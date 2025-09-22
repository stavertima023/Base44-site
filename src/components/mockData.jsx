export const mockProducts = [
  {
    id: "1",
    name: "Glo or Die Veteran Tee (Black)",
    price: 52,
    image_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/da9bda531_Revenge-Your-Love-Tee-Black-02.jpeg?quality=100&width=500",
    category: "tees",
    description: "100% Cotton. Made in USA. Available in Black and Blue. Official Product of Glo Gang.",
    is_featured: true
  },
  {
    id: "2",
    name: "Worldwide Tee (Black/Blue)",
    price: 45,
    image_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/902d7d645_Worldwide-Tee-BlackBlue-01.jpeg?quality=100&width=500",
    category: "tees",
    description: "Premium cotton t-shirt with Worldwide print design.",
    is_featured: false
  },
  {
    id: "3",
    name: "Cream Sage Hoodie",
    price: 85,
    image_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/657b5cb95_Cream-Sage-Hoodie-01.jpeg?quality=100&width=500",
    category: "hoodies",
    description: "Comfortable sage green hoodie with premium cotton blend.",
    is_featured: false
  },
  {
    id: "4",
    name: "Multi Denim Flare",
    price: 120,
    image_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/fbf1d0db5_Multi-Denim-Flare-01.jpeg?quality=100&width=500",
    category: "bottoms",
    description: "Stylish flare denim jeans with unique multi-color design.",
    is_featured: false
  },
  {
    id: "5",
    name: "GloGirl Lavender Top",
    price: 65,
    image_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/15c8c6633_GloGirl-Lavender-Top.jpeg?quality=100&width=500",
    category: "woman",
    description: "Elegant lavender top for women, perfect for any occasion.",
    is_featured: false
  },
  {
    id: "6",
    name: "Cross Round Tee (Purple)",
    price: 48,
    image_url: "https://example.com/cross-tee-purple.jpg",
    category: "new",
    description: "New arrival purple tee with cross design.",
    is_featured: true
  },
  {
    id: "7",
    name: "Glo Chain Tee (Black)",
    price: 42,
    original_price: 60,
    image_url: "https://example.com/chain-tee-black.jpg",
    category: "sale",
    description: "Black tee with chain print design - On Sale!",
    is_featured: false
  },
  {
    id: "8",
    name: "Ghosts Don't Die Tee (Black)",
    price: 50,
    image_url: "https://example.com/ghosts-tee.jpg",
    category: "tees",
    description: "Black tee with ghosts don't die graphic design.",
    is_featured: false
  },
  {
    id: "9",
    name: "Long Live Swagg Shorts (Black)",
    price: 75,
    image_url: "https://example.com/swagg-shorts.jpg",
    category: "bottoms",
    description: "Comfortable black shorts with Long Live Swagg print.",
    is_featured: false
  },
  {
    id: "10",
    name: "Ghosts Vintage Tee (White)",
    price: 55,
    image_url: "https://example.com/vintage-white.jpg",
    category: "tees",
    description: "Vintage style white tee with ghost graphics.",
    is_featured: false
  }
];

export const mockCart = [];

export const ProductService = {
  list: (sortBy = "-created_date", limit = 50) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let products = [...mockProducts];
        if (limit) {
          products = products.slice(0, limit);
        }
        resolve(products);
      }, 100);
    });
  },

  filter: (filters, sortBy = "-created_date", limit = 50) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let products = mockProducts.filter(product => {
          return Object.entries(filters).every(([key, value]) => {
            return product[key] === value;
          });
        });
        if (limit) {
          products = products.slice(0, limit);
        }
        resolve(products);
      }, 100);
    });
  }
};

export const CartService = {
  list: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        resolve(cart);
      }, 100);
    });
  },

  create: (item) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const newItem = { ...item, id: Date.now().toString() };
        cart.push(newItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        try {
          window.dispatchEvent(new CustomEvent('cart-updated'));
        } catch (_e) {}
        resolve(newItem);
      }, 100);
    });
  },

  update: (id, updatedItem) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const index = cart.findIndex(item => item.id === id);
        if (index !== -1) {
          cart[index] = { ...updatedItem, id };
          localStorage.setItem('cart', JSON.stringify(cart));
        }
        try {
          window.dispatchEvent(new CustomEvent('cart-updated'));
        } catch (_e) {}
        resolve(cart[index]);
      }, 100);
    });
  },

  delete: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const filteredCart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(filteredCart));
        try {
          window.dispatchEvent(new CustomEvent('cart-updated'));
        } catch (_e) {}
        resolve(true);
      }, 100);
    });
  }
};