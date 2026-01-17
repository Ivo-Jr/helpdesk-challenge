import type { Ticket } from "@/types/ticket";

// Array global para armazenar tickets (persiste durante execução do servidor)
let tickets: Ticket[] = [];

// Gerar tickets iniciais de exemplo
function initializeTickets(): Ticket[] {
  return [
    {
      id: crypto.randomUUID(),
      title: "[BUG] Sistema não carrega após login",
      description:
        "Ao tentar fazer login com minhas credenciais, a página fica completamente em branco e não carrega nenhum conteúdo. Tentei em diferentes navegadores com o mesmo resultado.",
      email: "dev@empresa.com",
      priority: "high",
      category: "bug",
      status: "open",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    },
    {
      id: crypto.randomUUID(),
      title: "Cobrança duplicada na fatura",
      description: "Cobrança aparece duplicada no meu extrato bancário",
      email: "financeiro@empresa.com.br",
      priority: "medium",
      category: "billing",
      status: "in_progress",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 horas atrás
    },
    {
      id: crypto.randomUUID(),
      title: "Adicionar modo escuro",
      description: "Suporte a tema escuro no aplicativo",
      email: "usuario@empresa.com",
      priority: "low",
      category: "feature",
      status: "open",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
    },
    {
      id: crypto.randomUUID(),
      title: "[BUG] Erro 500 ao salvar dados",
      description:
        "Ao tentar salvar informações do perfil, recebo um erro 500 e os dados não são salvos. Isso acontece toda vez que tento atualizar meu telefone de contato.",
      email: "suporte@empresa.io",
      priority: "high",
      category: "bug",
      status: "resolved",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
    },
    {
      id: crypto.randomUUID(),
      title: "Dúvida sobre exportação de relatórios",
      description: "Como exportar relatórios em formato PDF?",
      email: "contato@empresa.net",
      priority: "medium",
      category: "other",
      status: "open",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 horas atrás
    },
    {
      id: crypto.randomUUID(),
      title: "Plano não foi ativado após pagamento",
      description:
        "Realizei o pagamento do plano premium há 24 horas mas o plano ainda não foi ativado na minha conta. O valor já foi debitado do meu cartão de crédito.",
      email: "admin@minhaempresa.com",
      priority: "high",
      category: "billing",
      status: "open",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 horas atrás
    },
    {
      id: crypto.randomUUID(),
      title: "Integração com Slack",
      description: "Adicionar notificações no Slack",
      email: "dev@startup.io",
      priority: "low",
      category: "feature",
      status: "in_progress",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
    },
    {
      id: crypto.randomUUID(),
      title: "[BUG] Filtros não funcionam corretamente",
      description: "Filtros de busca retornam resultados errados",
      email: "qa@empresa.com",
      priority: "medium",
      category: "bug",
      status: "resolved",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
    },
  ];
}

// Inicializar tickets se o array estiver vazio
if (tickets.length === 0) {
  tickets = initializeTickets();
}

export { tickets };
