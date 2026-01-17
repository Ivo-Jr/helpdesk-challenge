import type { Ticket } from "@/types/ticket";

/**
 * Simular latência de rede (200-400ms)
 */
export async function simulateLatency(): Promise<void> {
  const delay = Math.floor(Math.random() * 200) + 200;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Simular erro aleatório (5% de chance)
 */
export function shouldSimulateError(): boolean {
  return Math.random() < 0.05;
}

/**
 * Criar resposta de erro JSON padronizada
 */
export function createErrorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

/**
 * Buscar ticket por ID
 */
export function findTicketById(
  tickets: Ticket[],
  id: string
): Ticket | undefined {
  return tickets.find((ticket) => ticket.id === id);
}

/**
 * Filtrar tickets por status
 */
export function filterByStatus(tickets: Ticket[], status?: string): Ticket[] {
  if (!status || status === "all") return tickets;
  return tickets.filter((ticket) => ticket.status === status);
}

/**
 * Buscar tickets por texto no título
 */
export function searchByTitle(tickets: Ticket[], search?: string): Ticket[] {
  if (!search) return tickets;
  const searchLower = search.toLowerCase();
  return tickets.filter((ticket) =>
    ticket.title.toLowerCase().includes(searchLower)
  );
}
