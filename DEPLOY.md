# Railway Deployment Guide

## Подготовка проекта завершена ✅

Проект готов к деплою на Railway через GitHub.

## Что настроено:

1. **API сервер** (`server/index.js`) - Express с CRUD для заказов
2. **Frontend** - React + Vite, собирается в `dist/`
3. **База данных** - Postgres-15 в Railway с тестовыми данными
4. **Dockerfile** - для контейнеризации
5. **railway.json** - конфигурация Railway

## Инструкция по деплою:

### 1. Подключение GitHub к Railway

1. Зайдите в ваш проект Railway: `Base44site`
2. Нажмите "New Service" → "GitHub Repo"
3. Выберите ваш репозиторий
4. Railway автоматически создаст сервис

### 2. Настройка переменных окружения

В Railway Dashboard → Variables добавьте:
- `DATABASE_URL` (уже есть на уровне проекта)
- `NODE_ENV=production`

### 3. Настройка деплоя

Railway автоматически:
- Обнаружит `package.json`
- Установит зависимости (`npm ci`)
- Соберет фронтенд (`npm run build`)
- Запустит сервер (`npm run start`)

### 4. Проверка

После деплоя:
- Сайт будет доступен по URL Railway
- API: `https://your-app.railway.app/api/orders`
- Админка: `https://your-app.railway.app/admin/orders`

## Локальная разработка:

```bash
# Запуск API + Frontend
npm run dev:all

# Только API
npm run api

# Только Frontend
npm run dev
```

## Структура проекта:

```
├── server/index.js          # Express API
├── src/pages/AdminOrders.jsx # Админка заказов
├── migrations/              # SQL миграции
├── Dockerfile              # Для Railway
├── railway.json           # Конфигурация Railway
└── package.json           # Скрипты и зависимости
```

## Готово к деплою! 🚀
