import { NextRequest } from "next/server";
import { tickets } from "./_store";
import {
  simulateLatency,
  shouldSimulateError,
  createErrorResponse,
  filterByStatus,
  searchByTitle,
} from "./_utils";
import type { Ticket } from "@/types/ticket";

/**
 * GET /api/tickets
 * Lista todos os tickets com suporte a filtros
 * Query params: ?status=open&search=bug
 */
export async function GET(request: NextRequest) {
  // Simular latência de rede
  await simulateLatency();

  // Simular erro aleatório (5%)
  if (shouldSimulateError()) {
    return createErrorResponse("Erro ao buscar tickets", 500);
  }

  // Extrair query params
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  // Aplicar filtros
  let filteredTickets = [...tickets];
  filteredTickets = filterByStatus(filteredTickets, status || undefined);
  filteredTickets = searchByTitle(filteredTickets, search || undefined);

  // Ordenar por data (mais recentes primeiro)
  filteredTickets.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return Response.json(filteredTickets);
}

/**
 * POST /api/tickets
 * Cria um novo ticket
 */
export async function POST(request: NextRequest) {
  // Simular latência de rede
  await simulateLatency();

  // Simular erro aleatório (5%)
  if (shouldSimulateError()) {
    return createErrorResponse("Erro ao criar ticket", 500);
  }

  try {
    const body = await request.json();

    // Validação básica dos campos obrigatórios
    if (!body.title || !body.description || !body.email) {
      return createErrorResponse("Campos obrigatórios faltando", 400);
    }

    // Criar novo ticket
    const newTicket: Ticket = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description,
      email: body.email,
      priority: body.priority || "medium",
      category: body.category || "other",
      status: body.status || "open",
      attachmentUrl: body.attachmentUrl || undefined,
      createdAt: new Date().toISOString(),
    };

    // Adicionar ao início do array (mais recente primeiro)
    tickets.unshift(newTicket);

    return Response.json(newTicket, { status: 201 });
  } catch {
    return createErrorResponse("Dados inválidos", 400);
  }
}
