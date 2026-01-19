## Tarefa

Implementar a submissão da edição de ticket usando o TicketForm, integrando com o endpoint PATCH /api/tickets/:id.

## Contexto

- Página de edição já existe
- TicketForm já suporta validações com Zod
- API mock implementa PATCH /api/tickets/:id
- Página de detalhe existe em /tickets/[id]

## Requisitos Técnicos

- Usar TicketForm com valores iniciais
- Ao submeter:
  - Chamar PATCH /api/tickets/:id
  - Desabilitar formulário durante submit
  - Tratar erro de API
- Em caso de sucesso:
  - Redirecionar para /tickets/[id]
- Em caso de erro:
  - Exibir erro
- Manter Client Component apenas onde necessário
- NÃO adicionar bibliotecas externas

## Output Esperado

- Edição de ticket funcional
- Redirecionamento após sucesso
- Feedback básico de erro
- Código claro e reutilizável
