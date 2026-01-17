# Relatório – Estados de UI (Loading, Erro e Vazio)

## Objetivo

Melhorar os estados de loading, erro e vazio da listagem de tickets, fornecendo feedback mais claro ao usuário sem adicionar complexidade ou dependências externas.

O foco desta etapa foi:

- UX consistente
- clareza visual
- simplicidade de implementação

---

## Abordagem

- Substituição de mensagens textuais por estados visuais simples
- Uso de CSS puro para animações leves
- Manutenção da arquitetura existente
- Nenhuma nova dependência adicionada

---

## Implementação Realizada

### Loading

- Uso de skeleton UI no `app/loading.tsx`
- Estrutura inspirada no layout real dos tickets
- Animação leve em CSS para melhorar percepção de carregamento

### Erro

- Melhoria do `app/error.tsx`
- Mensagem clara e acessível
- Ação principal para tentar novamente
- Estrutura simples e direta

### Estado Vazio

- Ajuste da renderização na página de listagem
- Mensagem explicativa e orientativa
- Indicação clara do próximo passo para o usuário

---

## O Que Foi Aproveitado da IA

- Estrutura dos skeletons
- Organização visual dos estados
- Sugestões de hierarquia de feedback

---

## Ajustes Manuais Realizados

- Simplificação do markup
- Adequação de nomes e estilos ao padrão do projeto
- Garantia de ausência de dependências externas

---

## Decisão Técnica

Optou-se por implementar os estados de UI utilizando apenas recursos nativos do React, Next.js e CSS, evitando bibliotecas de terceiros para manter controle, performance e simplicidade.

---

## Resultado Final

- Estados de UI claros e funcionais
- Melhor experiência do usuário em cenários comuns
- Código limpo e fácil de manter
- Base preparada para próximas evoluções de UX
