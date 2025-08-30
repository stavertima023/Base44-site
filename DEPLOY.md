# Деплой на Railway

## Подготовка проекта

1. Убедитесь, что все изменения закоммичены в Git
2. Проверьте, что проект собирается локально: `npm run build`

## Деплой на Railway

### Способ 1: Через Railway Dashboard (Рекомендуется)

1. Перейдите на [railway.app](https://railway.app)
2. Войдите в аккаунт или создайте новый
3. Нажмите "New Project"
4. Выберите "Deploy from GitHub repo"
5. Подключите ваш GitHub репозиторий
6. Выберите репозиторий `Base44 site`
7. Railway автоматически определит, что это Node.js приложение
8. Нажмите "Deploy Now"

### Способ 2: Через Railway CLI

1. Установите Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Войдите в Railway:
   ```bash
   railway login
   ```

3. Создайте новый проект:
   ```bash
   railway init
   ```

4. Деплойте:
   ```bash
   railway up
   ```

## Конфигурация

Проект уже настроен для Railway:
- `Dockerfile` - для контейнеризации
- `railway.json` - конфигурация Railway
- Скрипты в `package.json` настроены для production

## Переменные окружения

Если нужны переменные окружения, добавьте их в Railway Dashboard:
- `NODE_ENV=production`
- `PORT=3000` (устанавливается автоматически)

## Домен

После деплоя Railway автоматически предоставит URL вида:
`https://your-project-name-production.up.railway.app`

## Обновление

При каждом push в main ветку Railway автоматически пересоберет и перезапустит приложение.

## Мониторинг

В Railway Dashboard вы можете:
- Просматривать логи
- Мониторить производительность
- Настраивать масштабирование
- Управлять доменами
