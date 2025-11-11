# Arquitetura — Plataforma de Gestão para Grupos de Networking

## 1. Visão Geral
A plataforma tem como objetivo digitalizar e otimizar a gestão de grupos de networking, substituindo controles manuais por um sistema centralizado.  
Escopo inicial (entregável): **Fluxo de Admissão de Membros** (Intenção → Aprovação → Convite → Cadastro).

Stack escolhido:
- Frontend: Next.js + React
- Backend: Next.js API Routes (Node.js) ou Express (Node.js)
- Banco de dados: SQLite (dev) com Prisma ORM. Rápido e simples para avaliação; migrável para PostgreSQL.
- Testes: Jest + React Testing Library

Decisão técnica: usar Prisma facilita modelagem e migrações; Next.js permite prototipagem rápida com API Routes integradas.

---

## 2. Diagrama da Arquitetura

```mermaid
graph TD
  A[Frontend - Next.js/React] -->|HTTP/JSON| B[API - Node.js / Next API Routes]
  B -->|ORM - Prisma| C[(SQLite Database)]
  B --> D[Serviço de E-mail Simulado (console)]
  A --> E[Static Assets / CSS]
