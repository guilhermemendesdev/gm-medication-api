FROM node:20-slim AS base

FROM base AS deps
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY .npmrc* ./
COPY package.json ./
COPY package-lock.json* ./

COPY apps/report-service/package.json ./apps/report-service/
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY libs/core/package.json ./libs/core/
COPY libs/shared/package.json ./libs/shared/

RUN npm install --legacy-peer-deps

FROM base AS builder
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

COPY package.json ./
COPY tsconfig.base.json ./
COPY nx.json ./
COPY .npmrc* ./

COPY apps/report-service ./apps/report-service
COPY libs ./libs

COPY apps/report-service/docker-entrypoint.sh ./apps/report-service/docker-entrypoint.sh

WORKDIR /app/apps/report-service
RUN npx prisma generate

RUN npm run build

RUN if [ -f "dist/apps/report-service/src/main.js" ]; then \
      mkdir -p dist && \
      cp dist/apps/report-service/src/main.js dist/main.js && \
      cp -r dist/apps/report-service/src/* dist/ 2>/dev/null || true; \
    elif [ -f "dist/src/main.js" ]; then \
      cp dist/src/main.js dist/main.js && \
      cp -r dist/src/* dist/ 2>/dev/null || true; \
    fi && \
    test -f dist/main.js && \
    echo "✓ main.js encontrado" || \
    (find dist -name "main.js" 2>/dev/null && exit 1)

FROM base AS runner
RUN apt-get update && apt-get install -y \
    openssl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production

RUN groupadd -r nodejs && useradd -r -g nodejs -u 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/apps/report-service/src ./apps/report-service/src
COPY --from=builder --chown=nestjs:nodejs /app/apps/report-service/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/report-service/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/report-service/start.js ./start.js
COPY --from=builder --chown=nestjs:nodejs /app/apps/report-service/init-db.sh ./init-db.sh
COPY --from=builder --chown=nestjs:nodejs /app/apps/report-service/tsconfig.json ./apps/report-service/tsconfig.json
RUN chmod +x ./init-db.sh

COPY --from=builder --chown=nestjs:nodejs /app/libs ./libs
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/report-service/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/tsconfig.base.json ./tsconfig.base.json

COPY --from=builder --chown=root:root /app/apps/report-service/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3006

ENTRYPOINT ["/docker-entrypoint.sh"]
USER root

CMD ["node", "/app/start.js"]

