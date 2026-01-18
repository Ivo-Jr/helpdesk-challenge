# Relatório – Página de Criação de Ticket (/new)

## Objetivo
Implementar a página de criação de tickets com uma abordagem mínima e funcional, validando o fluxo principal de criação antes de introduzir abstrações ou bibliotecas adicionais.

---

## Abordagem
- Página implementada como **Client Component**
- Uso de formulário HTML nativo
- Validações básicas via HTML5
- Integração direta com o endpoint `POST /api/tickets`
- Redirecionamento para a listagem após sucesso

Nesta etapa, o foco foi garantir o fluxo de criação funcionando de ponta a ponta, sem overengineering.

---

## Implementação Realizada

### Página `/new`
- Criação do arquivo `app/new/page.tsx`
- Formulário com campos essenciais:
  - título
  - descrição
  - email
  - prioridade
  - categoria
  - anexo (opcional)
- Status definido como `open` por padrão
- Controle de loading durante o submit
- Tratamento simples de erro
- Botão de cancelamento retornando para a home

### Estilização
- Estilos básicos com SCSS Modules
- Layout responsivo
- Consistência visual com o design system existente

---

## O Que Foi Aproveitado da IA
- Estrutura geral da página
- Integração com a API mockada
- Fluxo de submit e redirecionamento

---

## Ajustes Manuais Realizados
- Nenhum ajuste estrutural relevante
- Implementação mantida simples por decisão consciente

---

## Decisão Técnica
Optou-se por **não utilizar React Hook Form nem Zod nesta etapa**, permitindo validar o fluxo principal de criação antes de introduzir camadas adicionais de abstração.

Essa decisão facilita evolução incremental e reduz complexidade inicial.

---

## Resultado Final
- Página `/new` funcional
- Criação de tickets integrada à API
- Fluxo simples e previsível
- Base preparada para evolução futura com validações e reutilização
