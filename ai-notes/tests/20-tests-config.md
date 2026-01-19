# Relatório – Testes Unitários da Configuração de Ambiente (config.ts)

## Objetivo
Garantir que a função `getBaseUrl()` seja previsível, segura e determinística em todos os ambientes (development, test e production), evitando falhas silenciosas de configuração.

---

## Abordagem
- Testes unitários puros com **Vitest**
- Isolamento completo de `process.env`
- Validação explícita de prioridades de variáveis
- Cobertura de ambientes reais (local, Vercel e produção)

---

## Implementação Realizada

### Testes da Função getBaseUrl
**Arquivo:** `app/_lib/__tests__/config.test.ts`

Cenários cobertos:

#### Prioridade de Variáveis
1. `NEXT_PUBLIC_API_URL` (prioridade máxima)
2. `VERCEL_URL` (fallback para deploy)
3. Erro explícito em produção sem configuração
4. Fallback para `http://localhost:3000` em dev/test

#### Ambientes Testados
- `NODE_ENV=development`
- `NODE_ENV=test`
- `NODE_ENV=production`
- `NODE_ENV` indefinido

#### Edge Cases
- Strings vazias ignoradas corretamente
- URLs com porta customizada
- Subdomínios complexos da Vercel
- Garantia de protocolo (`http://` / `https://`)

---

## O Que Foi Aproveitado da IA
- Estrutura dos cenários de prioridade
- Organização por grupos de responsabilidade
- Casos de borda relacionados a deploy real

---

## Ajustes Manuais Realizados
- Garantia de isolamento total com `beforeEach` / `afterEach`
- Validação explícita de mensagens de erro
- Verificação de pureza da função (não muta `process.env`)

---

## Decisão Técnica
Optou-se por testes explícitos de configuração porque erros de base URL:
- quebram a aplicação silenciosamente
- são difíceis de debugar em produção
- exigem comportamento determinístico

A função foi tratada como **infra crítica**, justificando cobertura extensa.

---

## Resultado Final
- 27 testes unitários adicionados
- 100% de sucesso na execução
- Cobertura completa de todos os ambientes
- Comportamento previsível e seguro
- Base sólida para deploy e CI/CD
