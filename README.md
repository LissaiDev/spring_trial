# Sistema de Gerenciamento de Usuários

Este é um monorepo contendo uma aplicação fullstack para gerenciamento de usuários, composta por um frontend em Next.js e um backend em Spring Boot.

## Estrutura do Projeto

```
competition/
├── client/          # Frontend Next.js
├── server/          # Backend Spring Boot
└── infra/          # Configurações de infraestrutura
```

## Tecnologias Utilizadas

### Frontend (client)
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hot Toast
- React Webcam
- Headless UI

### Backend (server)
- Spring Boot 3.4
- Spring Data JPA
- PostgreSQL
- Java 17
- Maven

## Funcionalidades

- ✅ CRUD completo de usuários
- 📸 Captura de fotos via webcam
- 🖼️ Upload e gerenciamento de imagens
- 🔍 Filtros avançados
- 🎨 Interface responsiva e animada
- 🌐 Integração API REST

## Requisitos

### Frontend
- Node.js 18+
- npm ou yarn

### Backend
- Java JDK 17+
- Maven 3.6+
- PostgreSQL 12+

## Configuração e Instalação

### Frontend

1. Instalar dependências:
```bash
cd client
npm install
```

2. Configurar variáveis de ambiente:
Crie um arquivo `.env.local` baseado no exemplo

3. Iniciar em desenvolvimento:
```bash
npm run dev
```

### Backend

1. Configurar banco de dados:
- Criar banco PostgreSQL
- Configurar credenciais em `application.properties`

2. Compilar e executar:
```bash
cd server
./mvnw spring-boot:run
```

## Estrutura do Frontend

```
client/
├── src/
│   ├── app/              # Páginas e rotas
│   ├── components/       # Componentes React
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilitários e tipos
│   └── services/        # Serviços de API
```

## Estrutura do Backend

```
server/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/server/server/
│       │       ├── config/      # Configurações
│       │       ├── controllers/ # Endpoints
│       │       ├── model/       # Entidades
│       │       ├── repository/  # Acesso dados
│       │       └── service/     # Lógica negócio
│       └── resources/          # Configurações
```

## Endpoints API

### Users
- `GET /users` - Lista todos usuários
- `GET /users/{id}` - Obtém usuário por ID
- `POST /users` - Cria novo usuário
- `PUT /users/{id}` - Atualiza usuário
- `DELETE /users/{id}` - Remove usuário

## Desenvolvimento

### Frontend
```bash
npm run dev
```

### Backend
```bash
./mvnw spring-boot:run
```

## Build

### Frontend
```bash
npm run build
```

### Backend
```bash
./mvnw clean package
```
