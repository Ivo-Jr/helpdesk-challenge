## Objetivo

Implementar uma API mockada para o CRUD de Tickets utilizando Route Handlers do Next.js (App Router), simulando um backend real sem uso de banco de dados.

A API serviria como base para o desenvolvimento e teste do frontend.

---

## Abordagem

- Utilização de dados mantidos em memória (array compartilhado)
- Implementação direta nos Route Handlers do Next.js
- Sem camadas extras (services, repositories, etc.)
- Foco em simplicidade e clareza, adequado ao escopo do challenge

---

## Endpoits Implementados

- `GET /api/tickets`
  Lista todos os tickets, com suporte a:
  - filtro por status (`?status=open`)
  - busca por texto no título (`search-bug`)

- `POST /api/tickets`
  Cria um novo ticket, gerando `id` e `createdAt`.

- `GET /api/tickets/[id]`
  Retorna um ticket específico ou `404` se não existir.

- `PATCH /api/tickets/[id]`
  Atualiza parcilmente um ticket existente.

- `DELETE /api/tickets/[id]`
  Remove um ticket existente.

Todos os endpoints retornam status code apropriados (200, 201, 204, 404, 500).

---

## Simulações

- Latência artificial entre 200-400ms
- Erro aleatório em ~5% das requisiçoes
- Tickets iniciais gerados com dados realistas

Essas simulaçoes permitem testar loading, erro e estados vazios no frontend.

---

## Problema Identificado

Durante os teste, foi identidicado que:

- a listagem funcionava corretamente
- a busca por ID retornava `404`, mesmo para tickets existentes

A causa foi a uma atualização do Next 16 onde o param agora é uma Promise e precisa ser "awaited".

---

## Ajuste Manual Realizado

- Mudança do route handler para `context: { params: Promise <{id: string}>}`;
- Garantia de que todos os Route Handlers estavan funcionando corretamente:
  - GET
  - DELETE
  - PATCH
- Reinício do servidor de desenvolvimento para validar o comportamento.

Após o ajuste, todos os endpoints passaram a funcionar corretamente.

---

## Decisão Técnica

A atualização de tickets foi implementada com `PATCH` (em vez de `PUT`), pois o frontend realiza edições parciais, o que reflete melhor o uso real da aplicação.

## Resultado Final

- CRUD completo funcional
- API estável para consumo pelo frontend
- Código simples, legível e sem abstrações prematuras
- Base sólida para a próxima etapa do projeto
