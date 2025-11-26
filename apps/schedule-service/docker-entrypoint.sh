#!/bin/bash
set -e

echo "⏳ Aguardando PostgreSQL estar pronto..."
until pg_isready -h postgres -U ${POSTGRES_USER:-postgres} 2>/dev/null; do
  echo "PostgreSQL não está pronto ainda, aguardando..."
  sleep 2
done

echo "✅ PostgreSQL está pronto!"

echo "🔍 Verificando estrutura do Prisma..."
ls -la /app/prisma/ || echo "Prisma não encontrado em /app/prisma"
find /app -name "schema.prisma" -type f 2>/dev/null || echo "Schema.prisma não encontrado"

echo "📦 Gerando Prisma Client..."
# O prisma está em /app/prisma (copiado pelo Dockerfile)
cd /app
if [ -f "./prisma/schema.prisma" ]; then
  echo "✅ Schema encontrado em /app/prisma/schema.prisma"
  npx prisma generate --schema=./prisma/schema.prisma
else
  echo "❌ Schema não encontrado em /app/prisma/schema.prisma, tentando localizar..."
  SCHEMA_PATH=$(find /app -name "schema.prisma" -type f | head -1)
  if [ -n "$SCHEMA_PATH" ]; then
    echo "✅ Schema encontrado em: $SCHEMA_PATH"
    npx prisma generate --schema="$SCHEMA_PATH"
  else
    echo "❌ Erro: Schema.prisma não encontrado!"
    exit 1
  fi
fi

echo "🔄 Executando migrações do banco de dados..."
SCHEMA_FILE="./prisma/schema.prisma"
if [ ! -f "$SCHEMA_FILE" ]; then
  SCHEMA_FILE=$(find /app -name "schema.prisma" -type f | head -1)
fi

# Sempre usar db push para desenvolvimento (mais simples e direto)
echo "📦 Sincronizando schema com o banco (db push)..."
npx prisma db push --schema="$SCHEMA_FILE" --accept-data-loss --skip-generate || {
  echo "⚠️ Erro ao executar db push, tentando novamente..."
  sleep 2
  npx prisma db push --schema="$SCHEMA_FILE" --accept-data-loss --skip-generate
}

echo "✅ Banco de dados inicializado com sucesso!"

echo "✅ Migrações concluídas. Iniciando aplicação..."
exec "$@"

