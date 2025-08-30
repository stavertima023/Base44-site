import React from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero секция */}
      <div className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            О НАС
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            Мы создаем культуру уличной моды
          </motion.p>
        </div>
      </div>

      {/* Основная секция */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Наша История</h2>
            <p className="text-gray-600 mb-4">
              Cold Culture началась как маленький магазин streetwear одежды с большой мечтой - 
              сделать эксклюзивную уличную моду доступной для всех.
            </p>
            <p className="text-gray-600 mb-4">
              Мы тщательно отбираем каждый бренд и каждую вещь, чтобы предложить нашим 
              клиентам только самое лучшее из мира уличной моды.
            </p>
            <p className="text-gray-600">
              Сегодня мы гордимся тем, что являемся домом для таких легендарных брендов 
              как Supreme, Off-White, Stone Island и многих других.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop"
              alt="Магазин одежды"
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Ценности */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Наши Ценности</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                Q
              </div>
              <h3 className="text-xl font-semibold mb-3">Качество</h3>
              <p className="text-gray-600">
                Только оригинальные товары от проверенных поставщиков
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                S
              </div>
              <h3 className="text-xl font-semibold mb-3">Стиль</h3>
              <p className="text-gray-600">
                Уникальные вещи для создания собственного неповторимого образа
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                C
              </div>
              <h3 className="text-xl font-semibold mb-3">Сервис</h3>
              <p className="text-gray-600">
                Быстрая доставка и персональный подход к каждому клиенту
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}