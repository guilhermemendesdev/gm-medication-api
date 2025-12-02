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
         ├──────────┬──────────┬──────────┬──────────────┐
         │          │          │          │              │
┌────────▼────────┐┌─────────▼────────┐┌─────────▼────────┐┌─────────▼────────┐
│  Auth Service   ││Medication Service││Schedule Service  ││Dose Tracking Svc │
│   (Porta 3001)  ││   (Porta 3002)   ││   (Porta 3003)   ││   (Porta 3004)   │
└─────────────────┘└─────────┬────────┘└─────────┬────────┘└─────────┬────────┘
                             │                    │                   │
                             │                    │                   │
┌────────────────────────────▼────────────────────▼───────────────────▼────────┐
│                           PostgreSQL                                        │
│                           (Porta 5432)                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────────────────┐
│                           RabbitMQ                                           │
│                        (Porta 5672)                                          │
│                        Management: (15672)                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                             │
                             │ Eventos
                             │
┌────────────────────────────▼──────────────┐
│      Notification Service                 │
│         (Porta 3005)                      │
│  - Push Notifications                     │
│  - Email                                  │
│  - WhatsApp                               │
└───────────────────────────────────────────┘
```

### Serviços

- **API Gateway** (`apps/api-gateway`): Ponto de entrada da API, roteamento e agregação
- **Auth Service** (`apps/auth-service`): Autenticação e autorização com JWT
- **Medication Service** (`apps/medication-service`): Gerenciamento de medicamentos e prescrições
- **Schedule Service** (`apps/schedule-service`): Gerenciamento de agendamentos de doses
- **Dose Tracking Service** (`apps/dose-tracking-service`): Rastreamento e confirmação de ingestão de doses
- **Notification Service** (`apps/notification-service`): Envio de notificações (Push, Email, WhatsApp)

### Mensageria

- **RabbitMQ**: Comunicação assíncrona entre microserviços via eventos (pub/sub)

### Bibliotecas Compartilhadas

- **Core** (`libs/core`): Entidades de domínio e regras de negócio
- **Shared** (`libs/shared`): DTOs, guards, strategies e utilitários compartilhados

## 🛠️ Tecnologias

- **NestJS** 10.x - Framework Node.js
- **TypeScript** 5.x - Linguagem principal
- **Prisma** 5.x - ORM para PostgreSQL
- **PostgreSQL** 15 - Banco de dados
- **RabbitMQ** - Mensageria (pub/sub)
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
- RabbitMQ na porta 5672 (Management na 15672)
- Auth Service na porta 3001
- Medication Service na porta 3002
- Schedule Service na porta 3003
- Dose Tracking Service na porta 3004
- Notification Service na porta 3005
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
│   ├── auth-service/         # Serviço de Autenticação
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   │   ├── domain/   # Camada de Domínio
│   │   │   │   │   ├── entities/
│   │   │   │   │   ├── ports/        # Interfaces (Ports)
│   │   │   │   │   └── services/     # Lógica de Negócio
│   │   │   │   └── infrastructure/   # Camada de Infraestrutura
│   │   │   │       └── adapters/     # Implementações (Adapters)
│   │   │   ├── infrastructure/
│   │   │   │   └── prisma/   # Prisma Service
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── Dockerfile
│   ├── medication-service/   # Serviço de Medicamentos e Prescrições
│   │   ├── src/
│   │   │   ├── medication/
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   └── repositories/
│   │   │   │   ├── application/
│   │   │   │   │   ├── use-cases/
│   │   │   │   │   └── dto/
│   │   │   │   └── infrastructure/
│   │   │   │       ├── controllers/
│   │   │   │       ├── adapters/
│   │   │   │       └── mappers/
│   │   │   ├── prescription/
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   ├── events/
│   │   │   │   │   ├── repositories/
│   │   │   │   │   └── ports/
│   │   │   │   ├── application/
│   │   │   │   │   ├── use-cases/
│   │   │   │   │   └── dto/
│   │   │   │   └── infrastructure/
│   │   │   │       ├── controllers/
│   │   │   │       ├── adapters/
│   │   │   │       └── mappers/
│   │   │   ├── infrastructure/
│   │   │   │   └── prisma/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── Dockerfile
│   └── schedule-service/     # Serviço de Agendamentos
│       ├── src/
│       │   ├── schedule/
│       │   │   ├── domain/
│       │   │   │   ├── entities/
│       │   │   │   ├── repositories/
│       │   │   │   ├── ports/
│       │   │   │   └── events/
│       │   │   ├── application/
│       │   │   │   └── use-cases/
│       │   │   └── infrastructure/
│       │   │       ├── controllers/
│       │   │       ├── adapters/
│       │   │       └── mappers/
│       │   ├── infrastructure/
│       │   │   └── prisma/
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── prisma/
│       │   └── schema.prisma
│       └── Dockerfile
│   ├── dose-tracking-service/  # Serviço de Rastreamento de Doses
│   │   ├── src/
│   │   │   ├── dose-tracking/
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   ├── events/
│   │   │   │   │   ├── repositories/
│   │   │   │   │   └── ports/
│   │   │   │   ├── application/
│   │   │   │   │   ├── use-cases/
│   │   │   │   │   ├── dto/
│   │   │   │   │   └── services/
│   │   │   │   └── infrastructure/
│   │   │   │       ├── controllers/
│   │   │   │       ├── adapters/
│   │   │   │       └── mappers/
│   │   │   ├── infrastructure/
│   │   │   │   └── prisma/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── Dockerfile
│   └── notification-service/  # Serviço de Notificações
│       ├── src/
│       │   ├── notification/
│       │   │   ├── domain/
│       │   │   │   └── ports/
│       │   │   ├── application/
│       │   │   │   └── services/
│       │   │   └── infrastructure/
│       │   │       └── adapters/
│       │   ├── infrastructure/
│       │   │   └── prisma/
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
- **Ports**: Interfaces que definem contratos (ex: `UserRepositoryPort`, `EventPublisherPort`)
- **Adapters**: Implementações concretas (ex: `PrismaUserRepositoryAdapter`, `RabbitMQEventPublisherAdapter`)
- **Infrastructure**: Configurações e serviços externos (Prisma, RabbitMQ, Controllers)

### Comunicação entre Microserviços

A comunicação entre serviços é feita via eventos assíncronos usando RabbitMQ:

#### Fluxo de Eventos

1. **PrescriptionCreatedEvent**
   - **Publisher**: Medication Service
   - **Subscribers**: Schedule Service
   - **Ação**: Gera agendamentos de doses automaticamente

2. **DoseScheduledEvent**
   - **Publisher**: Schedule Service
   - **Subscribers**: Dose Tracking Service, Notification Service
   - **Ação**: 
     - Dose Tracking cria registro de tracking
     - Notification Service envia lembrete ao paciente

3. **DoseTakenEvent**
   - **Publisher**: Dose Tracking Service
   - **Subscribers**: Notification Service (opcional)
   - **Ação**: Confirma ingestão e registra status

4. **DoseMissedEvent**
   - **Publisher**: Dose Tracking Service
   - **Subscribers**: Notification Service
   - **Ação**: Alerta cuidador e paciente sobre dose perdida

#### Canais de Notificação

O Notification Service suporta três canais (estrutura preparada, implementação mock):
- **Push Notifications**: Firebase Cloud Messaging / OneSignal
- **Email**: Nodemailer
- **WhatsApp**: Twilio / Meta WhatsApp Cloud API

Isso garante desacoplamento e escalabilidade entre os serviços.

## 📚 API Documentation

Após iniciar os serviços, acesse a documentação Swagger:

- **API Gateway**: http://localhost:3000/api/docs
- **Auth Service**: http://localhost:3001/api/docs
- **Medication Service**: http://localhost:3002/api/docs
- **Schedule Service**: http://localhost:3003/api/docs
- **Dose Tracking Service**: http://localhost:3004/api/docs
- **Notification Service**: http://localhost:3005/api/docs
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

### Endpoints Disponíveis

#### Auth Service

- `POST /api/v1/auth/register` - Registrar novo usuário
- `POST /api/v1/auth/login` - Realizar login

#### Medication Service

- `GET /api/v1/medications` - Listar todos os medicamentos
- `POST /api/v1/medications` - Criar novo medicamento
- `GET /api/v1/medications/:id` - Buscar medicamento por ID
- `PUT /api/v1/medications/:id` - Atualizar medicamento
- `DELETE /api/v1/medications/:id` - Deletar medicamento

- `GET /api/v1/prescriptions` - Listar prescrições (opcional: ?patientId=xxx)
- `POST /api/v1/prescriptions` - Criar nova prescrição
- `GET /api/v1/prescriptions/:id` - Buscar prescrição por ID
- `PUT /api/v1/prescriptions/:id` - Atualizar prescrição
- `DELETE /api/v1/prescriptions/:id` - Deletar prescrição

#### Schedule Service

- `GET /api/v1/schedules` - Listar agendamentos (opcional: ?patientId=xxx&prescriptionId=xxx)

#### Dose Tracking Service

- `POST /api/v1/dose/confirm/:doseId` - Confirmar ingestão de dose
- `GET /api/v1/dose/:doseId/status` - Obter status de uma dose
- `GET /api/v1/dose/patient/:patientId` - Listar histórico de doses de um paciente (opcional: ?startDate=xxx&endDate=xxx)

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

#### Criar Medicamento

```bash
curl -X POST http://localhost:3002/api/v1/medications \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paracetamol 500mg",
    "description": "Analgésico e antitérmico",
    "type": "Analgésico",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

#### Criar Prescrição

```bash
curl -X POST http://localhost:3002/api/v1/prescriptions \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "550e8400-e29b-41d4-a716-446655440000",
    "medicationId": "550e8400-e29b-41d4-a716-446655440001",
    "dose": 500,
    "unit": "mg",
    "frequency": "DAILY",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T23:59:59.000Z"
  }'
```

> **Nota**: Ao criar uma prescrição, um evento é publicado no RabbitMQ e o Schedule Service automaticamente gera os agendamentos de doses.

#### Listar Agendamentos

```bash
# Por paciente
curl -X GET "http://localhost:3003/api/v1/schedules?patientId=550e8400-e29b-41d4-a716-446655440000"

# Por prescrição
curl -X GET "http://localhost:3003/api/v1/schedules?prescriptionId=550e8400-e29b-41d4-a716-446655440002"
```

#### Confirmar Ingestão de Dose

```bash
curl -X POST http://localhost:3004/api/v1/dose/confirm/550e8400-e29b-41d4-a716-446655440003 \
  -H "Content-Type: application/json" \
  -d '{
    "takenAt": "2024-01-15T14:30:00.000Z"
  }'
```

#### Verificar Status de Dose

```bash
curl -X GET http://localhost:3004/api/v1/dose/550e8400-e29b-41d4-a716-446655440003/status
```

#### Listar Histórico de Doses do Paciente

```bash
curl -X GET "http://localhost:3004/api/v1/dose/patient/550e8400-e29b-41d4-a716-446655440000?startDate=2024-01-01&endDate=2024-01-31"
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

#### Medication Service

```bash
cd apps/medication-service

npm run start:dev      # Desenvolvimento
npm run start:prod     # Produção
npm run build          # Build
npm run lint           # Lint
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Executar migrações
```

#### Schedule Service

```bash
cd apps/schedule-service

npm run start:dev      # Desenvolvimento
npm run start:prod     # Produção
npm run build          # Build
npm run lint           # Lint
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Executar migrações
```

#### Dose Tracking Service

```bash
cd apps/dose-tracking-service

npm run start:dev      # Desenvolvimento
npm run start:prod     # Produção
npm run build          # Build
npm run lint           # Lint
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Executar migrações
```

#### Notification Service

```bash
cd apps/notification-service

npm run start:dev      # Desenvolvimento
npm run start:prod     # Produção
npm run build          # Build
npm run lint           # Lint
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Executar migrações
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
