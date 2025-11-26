FROM node:20-slim AS base

# Instalar dependências apenas quando necessário
FROM base AS deps
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*
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
# Instalar dependências para build
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Copiar arquivos de configuração necessários
COPY package.json ./
COPY tsconfig.base.json ./
COPY nx.json ./
COPY .npmrc* ./

# Copiar código fonte
COPY apps/auth-service ./apps/auth-service
COPY libs ./libs

# Copiar entrypoint script
COPY apps/auth-service/docker-entrypoint.sh ./apps/auth-service/docker-entrypoint.sh

# Gerar Prisma Client
WORKDIR /app/apps/auth-service
RUN npx prisma generate

# Verificar estrutura antes do build
RUN echo "=== Estrutura antes do build ===" && \
    pwd && \
    ls -la && \
    ls -la src/ | head -10 && \
    echo "=== Verificando NestJS CLI ===" && \
    npx nest --version || echo "NestJS CLI não encontrado" && \
    which nest || echo "nest não está no PATH"

# Build da aplicação usando NestJS CLI diretamente
RUN echo "=== Iniciando build ===" && \
    npm run build 2>&1 || (echo "Build falhou com código $?" && exit 1)

# Verificar se o build foi gerado e encontrar o main.js
RUN echo "=== Verificando build ===" && \
    pwd && \
    echo "Procurando main.js:" && \
    find . -name "main.js" -type f 2>/dev/null && \
    echo "Conteúdo de dist:" && \
    find dist -type f 2>/dev/null | head -20 || true

# Mover main.js para o local correto se necessário
RUN if [ -f "dist/apps/auth-service/src/main.js" ]; then \
      echo "Movendo main.js para dist/main.js" && \
      mkdir -p dist && \
      cp dist/apps/auth-service/src/main.js dist/main.js && \
      cp -r dist/apps/auth-service/src/* dist/ 2>/dev/null || true; \
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
# Instalar OpenSSL para Prisma em runtime
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production

RUN groupadd -r nodejs && useradd -r -g nodejs -u 1001 nestjs

# Verificar o que está sendo copiado
RUN echo "=== Verificando arquivos no builder antes de copiar ===" && \
    ls -la /app/apps/auth-service/dist/ 2>&1 || echo "dist não existe no builder"

# Copiar arquivos necessários
# Copiar código fonte TypeScript (necessário para ts-node)
COPY --from=builder --chown=nestjs:nodejs /app/apps/auth-service/src ./apps/auth-service/src
COPY --from=builder --chown=nestjs:nodejs /app/apps/auth-service/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/auth-service/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/auth-service/start.js ./start.js
COPY --from=builder --chown=nestjs:nodejs /app/apps/auth-service/init-db.sh ./init-db.sh
COPY --from=builder --chown=nestjs:nodejs /app/apps/auth-service/tsconfig.json ./apps/auth-service/tsconfig.json

# Tornar o script executável
RUN chmod +x ./init-db.sh
# Copiar libs (necessárias para imports em runtime)
COPY --from=builder --chown=nestjs:nodejs /app/libs ./libs
# Copiar apenas node_modules de produção (otimização)
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/auth-service/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/tsconfig.base.json ./tsconfig.base.json

# Verificar se main.js existe após copiar
RUN echo "=== Verificando após cópia ===" && \
    pwd && \
    ls -la && \
    ls -la dist/ && \
    test -f dist/main.js && \
    echo "✓ main.js encontrado após cópia" || \
    (echo "✗ ERRO: main.js não encontrado após cópia" && \
     echo "Conteúdo de dist:" && \
     ls -la dist/ && \
     exit 1)

# Instalar postgresql-client
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Copiar entrypoint script
COPY --from=builder --chown=root:root /app/apps/auth-service/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3001

# Usar entrypoint para executar migrações antes de iniciar
ENTRYPOINT ["/docker-entrypoint.sh"]

# Executar como root para ter acesso ao npx e prisma
# Em produção, considere usar um usuário não-root após as migrações
USER root

CMD ["node", "/app/start.js"]

