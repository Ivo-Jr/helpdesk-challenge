# Relatório – Filtros de Tickets via URL Search Params

## Objetivo

Adicionar filtros à listagem de tickets permitindo:

- filtrar por status
- buscar por título

Mantendo a URL como fonte de verdade para o estado da listagem.

---

## Abordagem

- Uso de **URL Search Params** (`?status=&search=`)
- Página principal mantida como **Server Component**
- Componente de filtros isolado como **Client Component**
- Navegação via `router.push`
- Feedback de loading com `useTransition`

Não foi utilizado estado global (Zustand) nesta etapa.

---

## Implementação Realizada

### Página de Listagem

- Leitura de `searchParams`
- Repasse dos filtros para a função de busca
- Renderização já filtrada no server
- Estratégia de renderização (ISR) mantida

### Componente `TicketFilters`

- Select para status
- Input para busca por título
- Aplicação dos filtros via URL
- Botão para limpar filtros quando ativos
- Comportamento previsível ao recarregar ou compartilhar a URL

---

## O Que Foi Aproveitado da IA

- Estrutura do componente de filtros
- Integração com URL search params
- Uso de `useTransition` para feedback durante navegação

---

## Ajustes Manuais Realizados

- Tipagem dos searchParams alinhada ao App Router
- Garantia de compatibilidade com a API existente
- Simplificação da UX (sem debounce ou otimizações prematuras)

---

## Decisão Técnica

Optou-se por filtros baseados em URL por:

- melhor integração com Server Components
- preservação do estado ao recarregar a página
- URLs compartilháveis
- comportamento alinhado a produtos reais

---

## Resultado Final

- Filtros funcionais e previsíveis
- Código simples e manutenível
- Integração clara entre UI, URL e backend
- Base pronta para paginação ou ordenação futura
