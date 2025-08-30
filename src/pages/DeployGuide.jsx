import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, ExternalLink } from "lucide-react";

export default function DeployGuidePage() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const prismaSchema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Brand {
  id        String    @id @default(cuid())
  name      String    @unique
  slug      String    @unique
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Category {
  id        String    @id @default(cuid())
  name      String    @unique
  slug      String    @unique
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Product {
  id          String           @id @default(cuid())
  title       String
  slug        String           @unique
  description String?
  priceCents  Int
  currency    String           @default("RUB")
  isFeatured  Boolean          @default(false)
  brandId     String
  categoryId  String
  brand       Brand            @relation(fields: [brandId], references: [id], onDelete: Cascade)
  category    Category         @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  images      ProductImage[]
  variants    ProductVariant[]
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

model ProductImage {
  id        String  @id @default(cuid())
  url       String
  index     Int
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model ProductVariant {
  id        String  @id @default(cuid())
  size      String
  color     String?
  sku       String  @unique
  stock     Int     @default(0)
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}`;

  const packageJson = `{
  "name": "streetwear-store",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "node scripts/seed.mjs",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.303.0",
    "framer-motion": "^10.16.16"
  },
  "devDependencies": {
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.0.4",
    "postcss": "^8.4.32",
    "prisma": "^5.7.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3"
  }
}`;

  const envVariables = `DATABASE_URL="postgresql://postgres:XAUUfnEdpZWkKJuZbHbSxdlYiOeRbaqR@switchback.proxy.rlwy.net:21106/railway"
ADMIN_PASSWORD="nbvf200332705"
ADMIN_TOKEN_SALT="token228356"
SUPABASE_URL="https://vqzyvnsyjrfjyczblahz.supabase.co"
SUPABASE_SERVICE_ROLE="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxenl2bnN5anJmanljemJsYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjI0MVc5MiwiZXhwIjoyMDY3ODE3NzkyfQ.Tx2TojfWfkussv0sGRIQ8cvIPxUkTDm_FhUeFMkrSpI"
SUPABASE_BUCKET="images"`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Гайд по деплою на Railway</h1>
        
        <div className="space-y-6">
          {/* Шаг 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                Создание Next.js проекта
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Создай новый Next.js проект с TypeScript:</p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                npx create-next-app@latest streetwear-store --typescript --tailwind --eslint --app
              </div>
            </CardContent>
          </Card>

          {/* Шаг 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                Установка Prisma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  npm install @prisma/client<br/>
                  npm install -D prisma<br/>
                  npx prisma init
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Шаг 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                  Схема Prisma (prisma/schema.prisma)
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(prismaSchema)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Копировать
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                {prismaSchema}
              </pre>
            </CardContent>
          </Card>

          {/* Шаг 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                  Package.json
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(packageJson)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Копировать
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                {packageJson}
              </pre>
            </CardContent>
          </Card>

          {/* Шаг 5 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                  Переменные окружения (.env.local)
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(envVariables)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Копировать
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                {envVariables}
              </pre>
            </CardContent>
          </Card>

          {/* Шаг 6 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                Настройка базы данных
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Выполни команды для настройки базы данных:</p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm space-y-1">
                npx prisma generate<br/>
                npx prisma migrate dev --name init<br/>
                npx prisma db seed
              </div>
            </CardContent>
          </Card>

          {/* Шаг 7 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">7</span>
                Деплой на Railway
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>1. Загрузи код в GitHub репозиторий</p>
                <p>2. Подключи репозиторий к Railway</p>
                <p>3. Railway автоматически настроит переменные окружения</p>
                <p>4. После деплоя выполни миграции через Railway CLI</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">💡 Совет:</p>
                  <p className="text-blue-700 text-sm mt-2">
                    Скопируй все файлы из этого приложения (pages, components, Layout.js) 
                    в папку app/ твоего Next.js проекта и адаптируй под API routes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Дополнительные ресурсы */}
          <Card>
            <CardHeader>
              <CardTitle>Полезные ссылки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a 
                  href="https://railway.app/docs" 
                  target="_blank" 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4" />
                  Документация Railway
                </a>
                <a 
                  href="https://www.prisma.io/docs" 
                  target="_blank" 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4" />
                  Документация Prisma
                </a>
                <a 
                  href="https://nextjs.org/docs" 
                  target="_blank" 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4" />
                  Документация Next.js
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}