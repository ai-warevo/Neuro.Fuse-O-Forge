FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat curl bash
WORKDIR /app

RUN curl -fsSL https://bun.sh/install | bash \
    && ln -s /root/.bun/bin/bun /usr/local/bin/bun

COPY frontend/package.json frontend/bun.lock* frontend/package-lock.json* ./
RUN bun install --frozen-lockfile

###

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /root/.bun /root/.bun
RUN ln -s /root/.bun/bin/bun /usr/local/bin/bun
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./
ENV NEXT_TELEMETRY_DISABLED 1
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN bun run build

###

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
