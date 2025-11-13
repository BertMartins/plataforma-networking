# 🧩 Plataforma de Networking — Teste Técnico Fullstack

Este projeto foi desenvolvido como parte do **Teste Técnico para Desenvolvedor(a) Fullstack**, simulando uma plataforma de **gestão de grupos de networking**.

O foco principal deste MVP é o **fluxo de admissão de novos membros**, desde o envio da intenção de participação até o cadastro completo após aprovação.

---

## 🚀 Tecnologias Utilizadas

### **Stack Principal**
- **Frontend:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Backend:** API Routes com **Node.js + Next.js**
- **Banco de Dados:** SQLite (via [Prisma ORM](https://www.prisma.io/))
- **Linguagem:** TypeScript
- **Testes:** Jest + React Testing Library (a implementar)

### **Outras Ferramentas**
- Prisma Client (ORM)
- PostCSS / CSS Modules
- Variáveis de ambiente com `.env`
- Utilitários próprios (`/src/utils/dateUtils.ts`)

---

## 📁 Estrutura do Projeto
```bash
web/
├─ prisma/ # schema.prisma + banco SQLite
├─ src/
│ ├─ app/
│ │ ├─ api/intencoes/ # Rotas REST da feature Intenções
│ │ ├─ globals.css
│ │ ├─ layout.tsx
│ │ └─ page.tsx
│ ├─ utils/ # Funções auxiliares (ex: datas)
│ └─ components/ # (próximos passos)
├─ ARQUITETURA.md # Documento técnico de arquitetura
└─ README.md # Este arquivo
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
npx prisma migrate dev
```

### 4️⃣ Rodar o ambiente de desenvolvimento
```bash
npm run dev
```

### 5️⃣ Acessar no navegador
```bash
http://localhost:3000
```
