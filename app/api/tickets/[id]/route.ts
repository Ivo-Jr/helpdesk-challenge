import { NextRequest } from "next/server";
import { tickets } from "../_store";
import {
  simulateLatency,
  shouldSimulateError,
  createErrorResponse,
  findTicketById,
} from "../_utils";

/**
 * GET /api/tickets/[id]
 * Busca um ticket específico por ID
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // Simular latência de rede
  await simulateLatency();

  // Simular erro aleatório (5%)
  if (shouldSimulateError()) {
    return createErrorResponse("Erro ao buscar ticket", 500);
  }

  const ticket = findTicketById(tickets, id);

  if (!ticket) {
    return createErrorResponse("Ticket não encontrado", 404);
  }

  return Response.json(ticket);
}

/**
 * PATCH /api/tickets/[id]
 * Atualiza um ticket parcialmente
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // Simular latência de rede
  await simulateLatency();

  // Simular erro aleatório (5%)
  if (shouldSimulateError()) {
    return createErrorResponse("Erro ao atualizar ticket", 500);
  }

  try {
    const body = await request.json();
    const ticketIndex = tickets.findIndex((t) => t.id === id);

    if (ticketIndex === -1) {
      return createErrorResponse("Ticket não encontrado", 404);
    }

    // Atualizar apenas campos fornecidos, preservando id e createdAt
    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      ...body,
      id: tickets[ticketIndex].id, // Preservar ID original
      createdAt: tickets[ticketIndex].createdAt, // Preservar data de criação
    };

    return Response.json(tickets[ticketIndex]);
  } catch {
    return createErrorResponse("Dados inválidos", 400);
  }
}

/**
 * DELETE /api/tickets/[id]
 * Exclui um ticket
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // Simular latência de rede
  await simulateLatency();

  // Simular erro aleatório (5%)
  if (shouldSimulateError()) {
    return createErrorResponse("Erro ao excluir ticket", 500);
  }

  const ticketIndex = tickets.findIndex((t) => t.id === id);

  if (ticketIndex === -1) {
    return createErrorResponse("Ticket não encontrado", 404);
  }

  // Remover ticket do array
  tickets.splice(ticketIndex, 1);

  // Retornar 204 No Content
  return new Response(null, { status: 204 });
}
