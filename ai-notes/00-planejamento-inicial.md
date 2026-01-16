# 01 – Planejamento Inicial do Projeto

## Objetivo

Planejar e estruturar o desenvolvimento de uma aplicação de Helpdesk (CRUD de Tickets),
avaliando domínio técnico em Next.js (App Router), React, TypeScript, organização de código,
UX, acessibilidade e boas práticas de frontend moderno.

## Contexto fornecido à IA

- Projeto em Next.js 16 com App Router
- Stack obrigatória:
  - Next.js
  - TypeScript
  - React.js
  - SCSS Modules
  - Zustand
  - React Hook Form + Zod
- Backend mockado via Route Handlers do Next.js
- CRUD completo de Tickets de Suporte
- Requisitos fortes de UX:
  - loading, error e empty states
  - feedbacks claros (toasts)
  - validações condicionais de formulário
  - acessibilidade básica

## Diretrizes de produto e UX definidas manualmente

- Interface inspirada em dashboards SaaS modernos (Linear, Zendesk, Notion)
- Layout clean, mobile-first, sem sidebar para reduzir complexidade
- Uso consistente de badges para status e prioridade
- Formulários claros, com mensagens de erro inline
- Confirmação explícita para ações destrutivas (exclusão)
- Componentes reutilizáveis e bem nomeados

## Estratégia de uso da IA

- A IA será usada como copiloto técnico para:
  - gerar boilerplate
  - sugerir estrutura de código
  - auxiliar em validações e stores
- Decisões finais de arquitetura, UX e organização são humanas
- Todo código gerado será revisado, adaptado e integrado manualmente

## Plano de execução por fases

O desenvolvimento seguirá as seguintes fases:

1. Setup do projeto e tooling
2. Sistema de design (SCSS)
3. Tipos e validações
4. API mockada
5. Estado global (Zustand)
6. Componentes base de UI
7. Componentes de domínio
8. Páginas (listagem, criação, detalhe, edição)
9. Refinamentos finais (UX, acessibilidade, performance)

## Observação crítica

O foco não é quantidade de features, mas clareza, organização, decisões técnicas coerentes
e aderência ao que seria esperado em um produto real.
