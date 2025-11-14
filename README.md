# 🚀 Plataforma de Networking – Sistema Completo (Fullstack Next.js + Prisma)

Gerencie **membros, presenças, indicações, reuniões 1a1, mensalidades, convites, intenções, avisos, usuários, financeiro**… tudo num painel único, moderno e responsivo.

Este projeto simula uma plataforma completa de gestão de grupos de networking — estilo BNI — incluindo **ciclo de admissão**, **rotinas administrativas**, **dashboard**, **autenticação JWT**, **CRUDs** e **painel com gráficos**.

---

# 🧰 Tecnologias Utilizadas

## Frontend
- Next.js 16 (App Router + Turbopack)
- React 18
- Chart.js + react-chartjs-2
- CSS customizado
- Componentização completa (Sidebar, Layout, Cards)

## Backend
- API REST com Next.js
- JWT para autenticação
- Prisma ORM
- Regras de negócio por módulo

## Banco de Dados
- SQLite para desenvolvimento
- Prisma Client para queries tipadas

---

# 📚 Módulos Implementados

### ✔️ Autenticação
- Login / Logout
- JWT
- Proteção de rotas
- Roles: admin | membro

### ✔️ Dashboard
- Métricas gerais
- Gráficos responsivos (presenças)
- Total financeiro recebido
- Cards animados e responsivos

### ✔️ Membros
- CRUD completo
- Modal estilizada
- Dropdowns modernos

### ✔️ Indicações
- CRUD
- Relacionamento de->para membro
- Status com badges

### ✔️ Presenças
- CRUD
- Filtros
- Integração com Dashboard

### ✔️ Mensalidades
- CRUD completo
- Mês referência
- Valor + status
- Soma automática de mensalidades pagas

### ✔️ Reuniões 1a1
- CRUD
- Relacionamento entre membros
- Observações opcionais

### ✔️ Avisos
- CRUD
- Ligado ao usuário criador

### ✔️ Obrigados
- CRUD
- Ligado ao membro

### ✔️ Financeiro
- CRUD
- Registro e categorização de movimentações

### ✔️ Usuários
- CRUD com filtros avançados (nome, email, role)
- Senha opcional ao editar
- Badge de role

### ✔️ Intenções
- CRUD
- Pré-cadastro de interessados
- Entrada para fluxo de convites

### ✔️ Convites
- Geração de token único
- Ligação com intenções
- Acesso para cadastro de novo membro

---

## 📁 Estrutura do Projeto
```bash
web/
├── prisma/
│   ├── schema.prisma        # Tabelas e relacionamentos
│   └── dev.db               # Banco SQLite
│
├── src/app/
│   ├── api/                 # Rotas REST (cada módulo tem CRUD completo)
│   ├── login/               # Tela de login
│   ├── dashboard/           # Dashboard com gráficos
│   ├── membros/
│   ├── presencas/
│   ├── indicacoes/
│   ├── mensalidades/
│   ├── reunioes/
│   ├── avisos/
│   ├── obrigados/
│   ├── financeiro/
│   ├── usuarios/
│   ├── intencoes/
│   └── convites/
│
├── src/components/
│   ├── Sidebar.tsx          # Sidebar global 
│   └── UI ...               # componentes auxiliares
│
└── README.md

```
---

## ⚙️ Como Rodar o Projeto Localmente

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/seu-usuario/plataforma-networking.git
cd plataforma-networking/web
```

### 2️⃣ Instalar dependências
```bash
npm install
```

### 3️⃣ Configurar o banco de dados
```bash
npx prisma migrate dev --name init
```

### 4️⃣ Rodar o ambiente de desenvolvimento
```bash
npm run dev
```

### 5️⃣ Acessar no navegador
```bash
http://localhost:3000/login
```
---

# 🔑 Variáveis de Ambiente (.env)

Crie um arquivo `.env`:
```bash
DATABASE_URL="postgresql://neondb_owner:npg_fA9mFkhQ2wSR@ep-plain-tooth-acwyv7gr-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="sua-chave-secreta-aqui"
```


---

# 🧨 Pontos Fortes do Projeto
- Código padronizado por módulo
- UI moderna e consistente
- Prisma com logs SQL
- Layout protegido por autenticação
- Tabelas responsivas
- CRUD completo em absolutamente todos os módulos
- Dashboard com gráficos reais

---

# 🎯 Próximos Passos
- Exportação CSV/Excel  
- Dashboard mais avançado  
- RBAC completo  
- Notificações internas  
- Webhooks para automações externas  

---
