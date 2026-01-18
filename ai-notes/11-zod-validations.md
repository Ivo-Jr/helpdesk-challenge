# Relatório – Validações do Formulário com Zod

## Objetivo
Adicionar validações ao formulário de criação de tickets, integrando Zod ao React Hook Form para garantir regras de negócio claras e feedback imediato ao usuário.

---

## Abordagem
- Utilização do schema Zod existente
- Integração com React Hook Form via `zodResolver`
- Exibição de mensagens de erro por campo
- Feedback visual simples para campos inválidos

A lógica de validação foi centralizada no schema,
evitando regras espalhadas pelo componente.

---

## Implementação Realizada

### Integração com React Hook Form
- Uso de `zodResolver(ticketSchema)`
- Validação executada no submit
- Erros acessados via `formState.errors`

### Validações Aplicadas
- Regras obrigatórias (tamanho mínimo, formato de e-mail, campos exigidos)
- Validações condicionais conforme o domínio:
  - prioridade alta exige descrição mais detalhada
  - tickets de bug exigem identificador no título
  - tickets de cobrança exigem e-mail corporativo

### Feedback ao Usuário
- Mensagens de erro exibidas abaixo dos campos
- Destaque visual em campos inválidos
- Submit bloqueado enquanto houver erros

---

## O Que Foi Aproveitado da IA
- Integração do Zod com React Hook Form
- Estrutura de exibição de erros no formulário
- Ajustes básicos de estilos para feedback visual

---

## Ajustes Manuais Realizados
- Correção de tipagem e remoção do cast.
- Manutenção do schema existente como fonte única de validação

---

## Decisão Técnica
Optou-se por utilizar Zod como camada central de validação,
permitindo:
- regras de negócio explícitas
- reutilização futura (ex.: edição)
- separação clara entre validação e UI

---

## Resultado Final
- Validações obrigatórias e condicionais funcionando
- Feedback claro ao usuário antes do submit
- Código mais limpo e organizado
- Formulário preparado para reutilização em outros fluxos
