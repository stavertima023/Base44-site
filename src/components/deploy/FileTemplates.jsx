import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export default function FileTemplates() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const prismaClientCode = `// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma`;

  const productsApiRoute = `// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get('brand')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where = {
      AND: [
        brand && brand !== 'all' ? { brand: { name: brand } } : {},
        category && category !== 'all' ? { category: { slug: category } } : {},
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { brand: { name: { contains: search, mode: 'insensitive' as const } } }
          ]
        } : {}
      ].filter(condition => Object.keys(condition).length > 0)
    }

    const products = await prisma.product.findMany({
      where: Object.keys(where.AND).length > 0 ? where : {},
      include: {
        images: {
          orderBy: { index: 'asc' },
          take: 1
        },
        brand: true,
        category: true,
        variants: true
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}`;

  const seedScript = `// scripts/seed.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Заполняем базу данных...')

  // Создаем бренды
  const supreme = await prisma.brand.upsert({
    where: { slug: 'supreme' },
    update: {},
    create: { name: 'Supreme', slug: 'supreme' }
  })

  const nike = await prisma.brand.upsert({
    where: { slug: 'nike' },
    update: {},
    create: { name: 'Nike', slug: 'nike' }
  })

  // Создаем категории
  const hoodies = await prisma.category.upsert({
    where: { slug: 'hoodies' },
    update: {},
    create: { name: 'Худи', slug: 'hoodies' }
  })

  // Создаем товары
  await prisma.product.create({
    data: {
      title: 'Supreme Box Logo Hoodie',
      slug: 'supreme-box-logo-hoodie',
      description: 'Классическое худи Supreme',
      priceCents: 1599000, // 15990 рублей в копейках
      isFeatured: true,
      brandId: supreme.id,
      categoryId: hoodies.id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600',
            index: 0
          }
        ]
      },
      variants: {
        create: [
          { size: 'S', color: 'Black', sku: 'supreme-s-black', stock: 5 },
          { size: 'M', color: 'Black', sku: 'supreme-m-black', stock: 3 },
          { size: 'L', color: 'Black', sku: 'supreme-l-black', stock: 2 }
        ]
      }
    }
  })

  console.log('База данных заполнена!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })`;

  const nextConfig = `// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'vqzyvnsyjrfjyczblahz.supabase.co']
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  }
}

module.exports = nextConfig`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Prisma Client (lib/prisma.ts)
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(prismaClientCode)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Копировать
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
            {prismaClientCode}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            API Route для товаров
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(productsApiRoute)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Копировать
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
            {productsApiRoute}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Скрипт заполнения БД (scripts/seed.mjs)
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(seedScript)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Копировать
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
            {seedScript}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Next.js конфигурация
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(nextConfig)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Копировать
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
            {nextConfig}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}