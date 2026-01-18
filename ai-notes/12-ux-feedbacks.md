# Relatório – Feedback de Submit no Formulário

## Objetivo
Melhorar a experiência do usuário durante o envio do formulário de criação de tickets, adicionando feedback visual claro para os estados de loading, sucesso e erro.

---

## Abordagem
- Manter o fluxo simples e previsível
- Feedback inline, sem sistema global de toast
- Melhorar comunicação com o usuário sem alterar regras de negócio
- Nenhuma dependência externa adicionada

---

## Implementação Realizada

### Loading no Submit
- Botão de submit desabilitado durante o envio
- Exibição de spinner/indicador visual no botão
- Prevenção de múltiplos envios acidentais

### Feedback de Sucesso
- Mensagem de sucesso exibida após criação do ticket
- Pequeno delay antes do redirecionamento
- Usuário confirma visualmente que a ação foi concluída

### Feedback de Erro
- Mensagem de erro clara e contextual
- Inclusão de ícone visual para reforçar o estado de falha
- Manutenção do formulário preenchido após erro

---

## O Que Foi Aproveitado da IA
- Sugestões de pontos de melhoria de UX
- Estrutura para exibição de mensagens de sucesso e erro
- Inclusão de feedback visual durante loading

---

## Ajustes Manuais Realizados
- Adequação do texto das mensagens ao contexto do projeto
- Garantia de simplicidade no fluxo (sem abstrações globais)

---

## Decisão Técnica
Optou-se por implementar feedbacks diretamente no formulário, evitando um sistema de notificações global neste momento.

Essa decisão mantém:
- menor complexidade
- código mais fácil de manter
- evolução incremental da UX

---

## Resultado Final
- Usuário recebe feedback claro durante todo o submit
- Melhor percepção de responsividade
- Fluxo de criação mais confiável e intuitivo
- Base pronta para reutilização do formulário em outros contextos
