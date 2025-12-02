#!/bin/bash
set -e

echo "⏳ Aguardando PostgreSQL estar pronto..."
until pg_isready -h postgres -U ${POSTGRES_USER:-postgres} 2>/dev/null; do
  echo "PostgreSQL não está pronto ainda, aguardando..."
  sleep 2
done

echo "✅ PostgreSQL está pronto!"

echo "📦 Gerando Prisma Client..."
cd /app
if [ -f "./prisma/schema.prisma" ]; then
  echo "✅ Schema encontrado em /app/prisma/schema.prisma"
  npx prisma generate --schema=./prisma/schema.prisma
else
  echo "❌ Schema não encontrado, tentando localizar..."
  SCHEMA_PATH=$(find /app -name "schema.prisma" -type f | head -1)
  if [ -n "$SCHEMA_PATH" ]; then
    echo "✅ Schema encontrado em: $SCHEMA_PATH"
    npx prisma generate --schema="$SCHEMA_PATH"
  else
    echo "⚠️ Schema.prisma não encontrado - continuando sem gerar client"
  fi
fi

echo "✅ Prisma Client gerado (se schema encontrado)"

echo "✅ Iniciando aplicação..."
exec "$@"

