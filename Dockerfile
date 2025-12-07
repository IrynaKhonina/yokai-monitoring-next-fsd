# Этап 1: Установка зависимостей
FROM node:22.17.1-alpine AS dependencies
WORKDIR /app

# Устанавливаем pnpm
RUN npm install -g pnpm@10.13.1

# Копируем только файлы зависимостей
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Этап 2: Сборка
FROM node:22.17.1-alpine AS builder
WORKDIR /app

# Устанавливаем pnpm
RUN npm install -g pnpm@10.13.1

# Копируем зависимости из первого этапа
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json

# Копируем исходный код
COPY . .

# Создаем .env файл для production
RUN echo "NODE_ENV=production" > .env.production

# Билдим проект
RUN pnpm run build

# Этап 3: Запуск
FROM node:22.17.1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Создаем непривилегированного пользователя
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Устанавливаем pnpm
RUN npm install -g pnpm@10.13.1

# Копируем только необходимые файлы
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# Устанавливаем только production зависимости
RUN pnpm install --frozen-lockfile --prod

# Копируем билд
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/public ./public

# Создаем директорию для логов
RUN mkdir -p /app/logs && chown nextjs:nodejs /app/logs

# Переключаемся на непривилегированного пользователя
USER nextjs

# Порт приложения
EXPOSE 3000

# Переменные окружения
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Запуск
CMD ["pnpm", "start"]