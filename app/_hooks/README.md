# Custom Hooks

Esta pasta está reservada para custom React hooks.

## Quando criar hooks customizados

Crie hooks nesta pasta **apenas quando necessário**:

- Quando houver lógica reutilizada em múltiplos componentes
- Quando componentes ficarem muito grandes e complexos
- Para abstrair lógica complexa de estado ou side effects

## Princípio YAGNI

Seguimos o princípio **YAGNI** (You Aren't Gonna Need It):

- Não crie abstrações prematuras
- Comece com a lógica diretamente nos componentes
- Extraia para hooks apenas quando a necessidade ficar clara

## Exemplos futuros

Hooks que podem ser criados conforme necessidade:

- `use-tickets.ts` - Se lógica de busca/manipulação for reutilizada
- `use-toast.ts` - Se precisar de wrapper do toast-store com lógica adicional
- `use-debounce.ts` - Para debounce de inputs de busca
- `use-local-storage.ts` - Para persistência local

## Convenções

- Nome em kebab-case: `use-example.ts`
- Exportar como função: `export function useExample() { ... }`
- Documentar parâmetros e retorno com JSDoc
