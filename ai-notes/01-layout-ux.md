# Relatório – Definição de Layout e UX (Helpdesk)

## Objetivo

Definir o layout base da aplicação de Helpdesk (CRUD de Tickets) sem uso de Figma, priorizando clareza, boas práticas de UX e padrões visuais de produtos SaaS modernos.

O layout serviria como base conceitual para:

- estrutura de pastas
- design system (SCSS)
- componentização
- decisões de renderização

---

## Prompt Utilizado

Foi solicitado à IA que definisse a estrutura de layout e UX da aplicação com base em princípios claros, sem foco em pixel-perfect, inspirado em produtos SaaS reais como Linear, Zendesk e Notion.

Diretrizes principais:

- Layout sem sidebar
- Header simples com CTA principal
- Conteúdo centralizado
- Listagem em cards
- Mobile-first
- Uso de badges para status e prioridade
- Sem bibliotecas de UI externas
- Sem animações complexas

---

## Resultado Gerado pela IA

A IA retornou um planejamento completo de layout e UX contendo:

- Definição visual global da aplicação
- Estrutura textual (wireframe) das páginas:
  - Listagem de tickets
  - Criação de ticket
  - Detalhe do ticket
  - Edição do ticket
- Hierarquia visual clara (títulos, ações, conteúdo)
- Estados importantes de UX:
  - loading
  - erro
  - estado vazio
- Proposta de design system inicial:
  - paleta de cores semântica
  - tipografia
  - espaçamentos
  - breakpoints
- Componentes visuais base (Button, Badge, Card, Modal, Toast)

O material retornado funcionou como um “Figma textual”, permitindo visualizar o produto final antes da implementação em código.

---

## Decisões Tomadas Manualmente

Após analisar o material gerado, algumas decisões foram tomadas de forma consciente:

### 1. Layout sem Figma

Optou-se por **não utilizar Figma ou Figma MCP**, pois:

- o desafio não fornece layout oficial
- o foco da avaliação é arquitetura, UX e decisões técnicas
- o layout textual é suficiente para guiar a implementação

Essa decisão foi considerada mais alinhada com um cenário real de produto em fase inicial.

---

### 2. Simplificação do Escopo Visual

Embora o layout proposto pela IA fosse bastante completo, optou-se por:

- não implementar todos os detalhes visuais sugeridos
- priorizar clareza, consistência e legibilidade
- evitar overengineering para um challenge técnico

O layout passou a ser tratado como **guia conceitual**, não como checklist rígido.

---

### 3. Padrões Visuais Adotados

Foram mantidas as seguintes decisões centrais:

- Header simples com CTA principal (“Novo Ticket”)
- Conteúdo centralizado com largura máxima (~1100px)
- Listagem em cards ao invés de tabela
- Formulários em coluna única (melhor UX e acessibilidade)
- Badges semânticos para status e prioridade
- Mobile-first como abordagem principal

---

## O Que Foi Aproveitado da IA

- Estrutura visual das páginas
- Hierarquia de informações
- Organização de estados de UX (loading, erro, vazio)
- Direção geral de identidade visual SaaS
- Separação clara entre conteúdo, ações e feedbacks

---

## O Que Foi Ajustado Manualmente

- Redução de abstrações visuais excessivas
- Simplificação do design system inicial
- Decisão consciente de implementar apenas o necessário
- Padronização de rotas em inglês (layout independente de idioma da UI)

---

## Decisão Técnica Final

O layout foi definido diretamente no código, guiado por princípios de UX e padrões
de produtos SaaS reais, sem dependência de ferramentas de design externas.

Essa abordagem permitiu:

- maior agilidade no desenvolvimento
- alinhamento direto entre layout e arquitetura
- foco no que realmente é avaliado no challenge: clareza, organização e decisões técnicas

---

## Impacto no Próximo Passo

A definição de layout e UX serviu como base direta para:

- definição da estrutura de pastas
- criação do design system (SCSS)
- planejamento da componentização
- escolha da estratégia de renderização por página
