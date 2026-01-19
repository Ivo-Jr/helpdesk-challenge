# AI Notes — Exclusão de Ticket

## Objetivo

Implementar a exclusão de tickets com confirmação explícita, garantindo segurança em ações destrutivas e mantendo consistência com o stack atual do projeto.

---

## Abordagem

- Modal customizado (sem bibliotecas externas)
- Client Component isolado para ação destrutiva
- Controle explícito de estados (aberto, loading, erro)
- Integração direta com a API mockada
- Redirecionamento após exclusão bem-sucedida

Decisão alinhada com:
- regras do projeto (`no external UI libs`)
- escopo do challenge
- evolução incremental da aplicação

---

## Implementação

### Arquivos Criados

- `app/_components/delete-ticket-button/DeleteTicketButton.tsx`
  - Client Component
  - Estados: `showModal`, `isDeleting`, `error`
  - Confirmação antes de excluir
  - Chamada `DELETE /api/tickets/[id]`
  - Redirecionamento para `/` após sucesso

- `app/_components/delete-ticket-button/DeleteTicketButton.module.scss`
  - Modal centralizado
  - Overlay escuro
  - Animações simples com CSS puro
  - Responsivo (mobile-first)

### Arquivos Modificados

- `app/tickets/[id]/page.tsx`
  - Integração do botão de exclusão
  - Passagem do `ticket.id` como prop

---

## Decisões Técnicas

- **Modal custom**
  - Evita dependência de bibliotecas externas
  - Mantém consistência com SCSS Modules
  - Controle total de UX e estilos

- **Não uso de shadcn/ui**
  - Dependência direta de Tailwind CSS
  - Stack atual do projeto utiliza SCSS

---


## Ajustes Manuais Realizados
- Variaveis sugeridas como hardecoded. Foi implementado nas variables
- Tentatica de utilizar o Tailwind por parte da IA. Portanto foi comentado isso no arquivo rules.

---

## UX e Acessibilidade

- Confirmação obrigatória antes da exclusão
- Múltiplas formas de fechar o modal:
  - botão "Cancelar"
  - botão "X"
  - clique no overlay
- Estado de loading no botão de exclusão
- Mensagem de erro inline em falha
- Uso de `aria-label` no botão de fechar

---

## Resultado Final

- Exclusão segura e explícita
- UX clara para ação destrutiva
- Código simples e isolado
- Zero dependências externas
- Stack e regras do projeto preservados
