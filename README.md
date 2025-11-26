# 🏥 GM Medication API

API para monitoramento de medicamentos construída com NestJS, arquitetura hexagonal e microserviços.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Documentation](#api-documentation)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Desenvolvimento](#desenvolvimento)

## 🎯 Sobre o Projeto

Sistema de monitoramento de medicamentos desenvolvido seguindo os princípios de:
- **Arquitetura Hexagonal (Ports & Adapters)**: Separação clara entre domínio e infraestrutura
- **Microserviços**: Serviços independentes e escaláveis
- **Monorepo**: Gerenciamento centralizado de múltiplos serviços
- **Clean Code**: Código limpo, modular e testável

## 🏗️ Arquitetura

```
┌─────────────────┐
│   API Gateway   │ (Porta 3000)
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
┌────────▼────────┐  ┌─────▼─────┐
│  Auth Service   │  │  (Futuros │
│   (Porta 3001)  │  │  Serviços)│
└────────┬────────┘  └───────────┘
         │
┌────────▼────────┐
│   PostgreSQL    │
│   (Porta 5432)  │
└─────────────────┘
```

### Serviços

- **API Gateway** (`apps/api-gateway`): Ponto de entrada da API, roteamento e agregação
- **Auth Service** (`apps/auth-service`): Autenticação e autorização com JWT

### Bibliotecas Compartilhadas

- **Core** (`libs/core`): Entidades de domínio e regras de negócio
- **Shared** (`libs/shared`): DTOs, guards, strategies e utilitários compartilhados

## 🛠️ Tecnologias

- **NestJS** 10.x - Framework Node.js
- **TypeScript** 5.x - Linguagem principal
- **Prisma** 5.x - ORM para PostgreSQL
- **PostgreSQL** 15 - Banco de dados
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **Docker & Docker Compose** - Containerização
- **Nx** - Gerenciamento de monorepo
- **ESLint & Prettier** - Linting e formatação
- **Husky** - Git hooks

## 📦 Pré-requisitos

- Node.js 20.x ou superior
- npm ou yarn
- Docker e Docker Compose
- Git

## 🚀 Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd gm-medication-api
```

2. Instale as dependências:

```bash
npm install
```

> **Nota**: Se você encontrar problemas com o `package-lock.json` ao fazer build do Docker, execute `npm run lockfile:fix` para regenerar o arquivo de lock.

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gm_medication
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gm_medication?schema=public

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Services
AUTH_SERVICE_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

## ⚙️ Configuração

### Configuração do Banco de Dados

O projeto usa Prisma como ORM. Para configurar o banco de dados:

1. Inicie o PostgreSQL com Docker:

```bash
npm run docker:up
```

2. Gere o Prisma Client:

```bash
npm run prisma:generate
```

3. Execute as migrações:

```bash
npm run prisma:migrate
```

## 🏃 Executando o Projeto

### Opção 1: Docker Compose (Recomendado)

Inicie todos os serviços com Docker:

```bash
npm run docker:up
```

Isso irá iniciar:
- PostgreSQL na porta 5432
- Auth Service na porta 3001
- API Gateway na porta 3000

Para parar os serviços:

```bash
npm run docker:down
```

Para ver os logs:

```bash
npm run docker:logs
```

### Opção 2: Desenvolvimento Local

1. Inicie apenas o PostgreSQL:

```bash
docker-compose up -d postgres
```

2. Configure o Prisma:

```bash
cd apps/auth-service
npx prisma generate
npx prisma migrate dev
```

3. Inicie os serviços:

Terminal 1 - Auth Service:
```bash
cd apps/auth-service
npm run start:dev
```

Terminal 2 - API Gateway:
```bash
cd apps/api-gateway
npm run start:dev
```

## 📁 Estrutura do Projeto

```
gm-medication-api/
├── apps/
│   ├── api-gateway/          # API Gateway
│   │   ├── src/
│   │   │   ├── health/       # Health check
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── Dockerfile
│   └── auth-service/         # Serviço de Autenticação
│       ├── src/
│       │   ├── auth/
│       │   │   ├── domain/   # Camada de Domínio
│       │   │   │   ├── entities/
│       │   │   │   ├── ports/        # Interfaces (Ports)
│       │   │   │   └── services/     # Lógica de Negócio
│       │   │   └── infrastructure/   # Camada de Infraestrutura
│       │   │       └── adapters/     # Implementações (Adapters)
│       │   ├── infrastructure/
│       │   │   └── prisma/   # Prisma Service
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── prisma/
│       │   └── schema.prisma
│       └── Dockerfile
├── libs/
│   ├── core/                 # Entidades de Domínio
│   │   └── src/
│   │       └── domain/
│   │           └── entities/
│   └── shared/               # Código Compartilhado
│       └── src/
│           ├── dtos/
│           ├── decorators/
│           ├── guards/
│           └── strategies/
├── docker-compose.yml
├── nx.json
├── package.json
├── tsconfig.base.json
└── README.md
```

### Arquitetura Hexagonal

O projeto segue a arquitetura hexagonal (Ports & Adapters):

- **Domain**: Entidades e lógica de negócio pura
- **Ports**: Interfaces que definem contratos (ex: `UserRepositoryPort`)
- **Adapters**: Implementações concretas (ex: `PrismaUserRepositoryAdapter`)
- **Infrastructure**: Configurações e serviços externos

## 📚 API Documentation

Após iniciar os serviços, acesse a documentação Swagger:

- **API Gateway**: http://localhost:3000/api/docs
- **Auth Service**: http://localhost:3001/api/docs

### Endpoints Disponíveis

#### Auth Service

- `POST /api/v1/auth/register` - Registrar novo usuário
- `POST /api/v1/auth/login` - Realizar login

#### API Gateway

- `GET /api/v1/health` - Health check

### Exemplo de Uso

#### Registrar Usuário

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "senha": "senha123",
    "role": "PACIENTE"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "senha123"
  }'
```

#### Usar Token JWT

```bash
curl -X GET http://localhost:3000/api/v1/health \
  -H "Authorization: Bearer <seu-token-jwt>"
```

## 📜 Scripts Disponíveis

### Scripts Principais

```bash
# Build
npm run build

# Lint
npm run lint

# Formatação
npm run format
npm run format:check

# Lock file
npm run lockfile:fix   # Regenerar package-lock.json

# Docker
npm run docker:up      # Iniciar serviços
npm run docker:down    # Parar serviços
npm run docker:logs   # Ver logs

# Prisma
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Executar migrações
npm run prisma:studio    # Abrir Prisma Studio
```

### Scripts por Serviço

#### Auth Service

```bash
cd apps/auth-service

npm run start:dev      # Desenvolvimento
npm run start:prod     # Produção
npm run build          # Build
npm run lint           # Lint
```

#### API Gateway

```bash
cd apps/api-gateway

npm run start:dev      # Desenvolvimento
npm run start:prod     # Produção
npm run build          # Build
npm run lint           # Lint
```

## 🔧 Desenvolvimento

### Roles Disponíveis

O sistema suporta três roles:

- `PACIENTE`: Usuário paciente
- `CUIDADOR`: Usuário cuidador
- `ADMIN`: Administrador do sistema

### Usando Guards e Decorators

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, Roles } from '@gm-medication-api/shared';
import { UserRole } from '@gm-medication-api/core';

@Controller('example')
@UseGuards(JwtAuthGuard)
export class ExampleController {
  @Get('admin-only')
  @Roles(UserRole.ADMIN)
  adminOnly() {
    return { message: 'Apenas admins' };
  }

  @Get('paciente-or-cuidador')
  @Roles(UserRole.PACIENTE, UserRole.CUIDADOR)
  pacienteOrCuidador() {
    return { message: 'Pacientes ou cuidadores' };
  }
}
```

### Adicionando Novos Serviços

1. Crie a estrutura do serviço em `apps/`
2. Configure o `package.json` do serviço
3. Adicione ao `docker-compose.yml` se necessário
4. Configure as rotas no API Gateway

### Git Hooks

O projeto usa Husky para executar lint e formatação antes de commits:

- **pre-commit**: Executa ESLint e Prettier nos arquivos alterados

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
2. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
3. Push para a branch (`git push origin feature/nova-feature`)
4. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário.

---

Desenvolvido com ❤️ usando NestJS e Arquitetura Hexagonal
