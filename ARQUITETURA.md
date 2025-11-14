# 🏗️ Arquitetura do Sistema — Plataforma de Networking

Este documento descreve a arquitetura da aplicação, seus módulos, camadas, modelos de banco, fluxo de dados e padrões adotados.  
O objetivo é fornecer uma visão clara e organizada para manutenção, evolução e auditoria técnica.

---

# 📌 Visão Geral da Arquitetura

A aplicação segue uma arquitetura **Fullstack monolítica** utilizando **Next.js 16 (App Router)** com:

- **Frontend** e **Backend** integrados no mesmo projeto  
- **API REST** organizada por módulos  
- Banco SQL utilizando **Prisma ORM**
- Interface reativa em **React**
- Autenticação baseada em **JWT**

A arquitetura é dividida em:

1. **Interface (UI)**
2. **Camada de Aplicação**
3. **Camada de Dados (Prisma ORM)**
4. **Persistência (SQLite)**

---

# 🧩 Organização de Pastas

```bash
/web
├── prisma/
│ ├── schema.prisma
│ └── dev.db
│
├── src/app/
│ ├── api/ (todas as rotas REST por módulo)
│ │ ├── membros/
│ │ ├── presencas/
│ │ ├── indicacoes/
│ │ ├── mensalidades/
│ │ ├── reunioes/
│ │ ├── avisos/
│ │ ├── obrigados/
│ │ ├── financeiro/
│ │ ├── usuarios/
│ │ ├── intencoes/
│ │ └── convites/
│ │
│ ├── dashboard/
│ ├── login/
│ ├── layout.tsx
│ └── globals.css
│
├── src/components/
│ └── Sidebar.tsx
│
└── README.md / ARQUITETURA.md
```


---

# 🗂️ Organização dos Módulos

Cada módulo segue a mesma estrutura:
```bash
/api/modulo/
route.ts # GET e POST
/api/modulo/[id]/
route.ts # GET, PUT, DELETE
/modulo/page.tsx # Tela do módulo no painel
```


Exemplo: `/membros`, `/presencas`, `/mensalidades`, etc.

---

# 🧱 Camadas do Sistema

## 1. Interface (Frontend)
- Desenvolvido em React + Next.js
- Usa **useEffect**, **fetch**, **modais**, **tabelas e formulários**
- Componentes globais:
  - Sidebar
  - Cards
  - Tabelas padronizadas
  - Modal base
- Dashboard utiliza **react-chartjs-2** + Chart.js

## 2. API (Backend)
- Rotas server-side dentro de `/app/api`
- Métodos suportados:
  - GET
  - POST
  - PUT
  - DELETE  
- Cada módulo tem seu CRUD isolado

### Padrão de Implementação
Todas as rotas seguem este padrão:

```bash
export async function GET(req: Request) {}
export async function POST(req: Request) {}
export async function PUT(req: Request, { params }: any) {}
export async function DELETE(req: Request, { params }: any) {}
```

# 🗄️ Banco de Dados & Prisma ORM

## 🎯 Modelo relacional

Todos os relacionamentos são definidos em `schema.prisma`.

### Membro
Membro {
  id             String   @id @default(uuid())
  nome           String
  email          String   @unique
  ...
  presencas      Presenca[]
  indicacoesFeitas      Indicacao[] @relation("IndicacoesFeitas")
  indicacoesRecebidas   Indicacao[] @relation("IndicacoesRecebidas")
}

### Presença
Presenca {
  id       String   @id @default(uuid())
  membroId String
  data     DateTime @default(now())
  status   String   @default("presente")
}

### Mensalidade
Mensalidade {
  id         String @id @default(uuid())
  membroId   String
  mes        Int
  ano        Int
  valor      Float
  status     String @default("pendente")
}

### Convite + Intenção
Intencao {
  id       String   @id @default(uuid())
  status   String   @default("pendente")
  convite  Convite?
}

Convite {
  id         String  @id @default(uuid())
  token      String  @unique
  intencaoId String  @unique
}


# 🔐 Autenticação e Autorização

A autenticação usa:

- Login via API  
- JWT assinado  
- Cookies HttpOnly  
- Proteção do layout com verificação automática  

Roles implementadas:
- admin
- membro

O painel inteiro é protegido.


# 🔄 Fluxo de Dados Geral

### Exemplo: Criar uma nova presença

1. Usuário abre modal → envia formulário  
2. Front chama:
   POST /api/presencas  
3. Backend valida e grava via Prisma:
   prisma.presenca.create(...)  
4. Front atualiza a tabela chamando GET /api/presencas  
5. Dashboard usa estes dados para calcular estatísticas  


# 📊 Dashboard

Métricas calculadas:

- Total de membros  
- Presentes / Faltas  
- Número de indicações  
- Total de mensalidades pagas  
- Gráfico doughnut responsivo (chart.js)  


# 📦 Decisões de Arquitetura

✔ Centralização de CRUDs por módulo  
Cada funcionalidade tem uma API própria, facilitando manutenção.

✔ Banco único com SQLite + Prisma  
Ideal para MVP rápido e ambiente local.

✔ Uso de modais ao invés de páginas dedicadas  
Melhora o fluxo e diminui navegação excessiva.

✔ Sidebar fixa  
Mantém contexto sempre visível.

✔ CSS global padronizado  
Tabelas, badges, botões, inputs, dropdowns seguem estilo único.


# 🧪 Testabilidade

Mesmo sem testes implementados, a estrutura facilita testes:

- APIs independentes → testes unitários fáceis com Jest  
- Prisma → fácil de mockar  
- Componentes React simples → teste com RTL  
- Fluxos previsíveis → testes E2E futuros  


# 🚀 Possíveis Evoluções Futuras

- Exportação CSV/Excel para todos os módulos  
- Dashboard avançado com filtros  
- Sistema de permissões avançado (RBAC)  
- Notificações internas  
- Webhooks de integração  
- Módulo de relatórios  


# 📞 Manutenção e Suporte

O projeto foi organizado para permitir:

- Fácil criação de novos módulos  
- Fácil alteração do banco  
- API uniforme e previsível  
- Componentes reaproveitáveis  

Qualquer dev pode entrar e evoluir rapidamente.
