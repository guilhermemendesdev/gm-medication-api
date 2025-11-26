#!/bin/bash
set -e

echo "⏳ Aguardando PostgreSQL ficar disponível..."

until pg_isready -h "${POSTGRES_HOST:-postgres}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER:-postgres}" > /dev/null 2>&1; do
  echo "⏳ PostgreSQL não está disponível ainda - aguardando..."
  sleep 2
done

echo "✅ PostgreSQL está disponível!"

