# --- ЭТАП 1: Установка зависимостей ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat curl bash
WORKDIR /app

# Устанавливаем Bun
RUN curl -fsSL https://bun.sh/install | bash \
    && ln -s /root/.bun/bin/bun /usr/local/bin/bun

# Копируем файлы зависимостей
COPY frontend/package.json frontend/bun.lock* frontend/package-lock.json* ./

# Используем Bun для супербыстрой установки
# Он автоматически подхватит package-lock.json, если нет bun.lock
RUN bun install --frozen-lockfile

# --- ЭТАП 2: Сборка приложения ---
FROM node:20-alpine AS builder
WORKDIR /app
# Копируем установленные модули и Bun из первого этапа
COPY --from=deps /root/.bun /root/.bun
RUN ln -s /root/.bun/bin/bun /usr/local/bin/bun
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./

ENV NEXT_TELEMETRY_DISABLED 1
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Собираем проект через Bun (это быстрее)
RUN bun run build

# --- ЭТАП 3: Финальный образ (Production) ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# В финальном образе Bun НЕ НУЖЕН, только результат сборки
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
