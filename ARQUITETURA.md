# 🏗️ Documento de Arquitetura — Plataforma de Networking

## 📘 Visão Geral

Este documento descreve a **arquitetura da plataforma de gestão de grupos de networking**, desenvolvida como parte do **Teste Técnico Fullstack**.  
O objetivo é apresentar uma solução **escalável, organizada e moderna**, utilizando boas práticas de desenvolvimento **fullstack com Next.js, Node.js e Prisma ORM**.

O foco principal é o **fluxo de admissão de membros**, desde o envio da intenção até o cadastro completo dos aprovados.

---

## 🧩 Visão da Solução

A aplicação segue uma arquitetura **Fullstack monolítica modular**, baseada no **Next.js (App Router)**, permitindo que o frontend e o backend coexistam no mesmo código-base.

### ⚙️ Diagrama da Arquitetura

```mermaid
graph TD
    A[👤 Usuário] -->|Browser / HTTP| B[Frontend - Next.js (React)]
    B -->|Chamada| C[API Routes - Backend Node.js]
    C -->|ORM| D[(🗄️ Banco de Dados SQLite via Prisma)]
    C -->|Simulação| E[🪄 Geração de Convite (Token)]