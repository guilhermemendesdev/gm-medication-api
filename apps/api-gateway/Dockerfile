FROM node:20-slim AS base

# Instalar dependências apenas quando necessário
FROM base AS deps
WORKDIR /app

# Copiar arquivos de configuração do npm
COPY .npmrc* ./
COPY package.json ./
COPY package-lock.json* ./

# Copiar todos os package.json dos workspaces
COPY apps/auth-service/package.json ./apps/auth-service/
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY libs/core/package.json ./libs/core/
COPY libs/shared/package.json ./libs/shared/

# Instalar dependências
# Usando npm install que é mais tolerante com workspaces e resolve conflitos automaticamente
RUN npm install --legacy-peer-deps

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Copiar arquivos de configuração necessários
COPY package.json ./
COPY tsconfig.base.json ./
COPY nx.json ./
COPY .npmrc* ./

# Copiar código fonte
COPY apps/api-gateway ./apps/api-gateway
COPY libs ./libs

# Build da aplicação usando NestJS CLI diretamente
WORKDIR /app/apps/api-gateway
RUN npm run build

# Verificar se o build foi gerado e encontrar o main.js
RUN echo "=== Verificando build ===" && \
    pwd && \
    echo "Procurando main.js:" && \
    find . -name "main.js" -type f 2>/dev/null && \
    echo "Conteúdo de dist:" && \
    find dist -type f 2>/dev/null | head -20 || true

# Mover main.js para o local correto se necessário
RUN if [ -f "dist/apps/api-gateway/src/main.js" ]; then \
      echo "Movendo main.js para dist/main.js" && \
      mkdir -p dist && \
      cp dist/apps/api-gateway/src/main.js dist/main.js && \
      cp -r dist/apps/api-gateway/src/* dist/ 2>/dev/null || true; \
    elif [ -f "dist/src/main.js" ]; then \
      echo "Movendo main.js de dist/src para dist/" && \
      cp dist/src/main.js dist/main.js && \
      cp -r dist/src/* dist/ 2>/dev/null || true; \
    fi && \
    test -f dist/main.js && \
    echo "✓ main.js encontrado em dist/main.js" || \
    (echo "✗ ERRO: main.js não encontrado após mover" && \
     find dist -name "main.js" 2>/dev/null && \
     exit 1)

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN groupadd -r nodejs && useradd -r -g nodejs -u 1001 nestjs

# Copiar arquivos necessários
# Copiar código fonte TypeScript (necessário para ts-node)
COPY --from=builder --chown=nestjs:nodejs /app/apps/api-gateway/src ./apps/api-gateway/src
COPY --from=builder --chown=nestjs:nodejs /app/apps/api-gateway/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api-gateway/start.js ./start.js
COPY --from=builder --chown=nestjs:nodejs /app/apps/api-gateway/tsconfig.json ./apps/api-gateway/tsconfig.json
# Copiar libs (necessárias para imports em runtime)
COPY --from=builder --chown=nestjs:nodejs /app/libs ./libs
# Copiar apenas node_modules de produção (otimização)
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api-gateway/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/tsconfig.base.json ./tsconfig.base.json

# Verificar se main.js existe antes de continuar
RUN test -f dist/main.js || (echo "ERROR: main.js not found in dist directory" && ls -la dist/ && exit 1)

USER nestjs

EXPOSE 3000

CMD ["node", "start.js"]

