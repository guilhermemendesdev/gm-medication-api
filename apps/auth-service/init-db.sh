#!/bin/sh
set -e

echo "⏳ Aguardando PostgreSQL estar pronto..."
until pg_isready -h postgres -U ${POSTGRES_USER:-postgres} 2>/dev/null; do
  echo "PostgreSQL não está pronto ainda, aguardando..."
  sleep 2
done

echo "✅ PostgreSQL está pronto!"

echo "📦 Gerando Prisma Client..."
cd /app/apps/auth-service
npx prisma generate

echo "🔄 Executando migrações do banco de dados..."
# Tenta deploy primeiro (para produção), se falhar tenta dev (para desenvolvimento)
npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init --create-only && npx prisma migrate deploy

echo "✅ Banco de dados inicializado com sucesso!"

# Executar o comando passado como argumento
exec "$@"

