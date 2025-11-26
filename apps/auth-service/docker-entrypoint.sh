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
# Verificar se já existem migrações
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "📦 Aplicando migrações existentes..."
  npx prisma migrate deploy
else
  echo "📦 Nenhuma migração encontrada, sincronizando schema com o banco (db push)..."
  # db push sincroniza o schema com o banco sem criar arquivos de migração
  # Ideal para desenvolvimento inicial
  npx prisma db push --accept-data-loss --skip-generate
  echo "✅ Schema sincronizado com sucesso!"
fi

echo "✅ Banco de dados inicializado com sucesso!"

# Voltar para /app antes de executar o comando
cd /app

# Executar o comando passado como argumento
exec "$@"

