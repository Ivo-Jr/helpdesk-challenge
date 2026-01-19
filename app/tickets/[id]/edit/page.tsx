import { notFound } from "next/navigation";
import { ticketApi } from "@/lib/api";
import type { Ticket } from "@/types/ticket";
import { EditTicketClient } from "./EditTicketClient";

type Params = Promise<{ id: string }>;

export default async function EditTicketPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  
  let ticket: Ticket | null = null;

  try {
    ticket = await ticketApi.getById(id, {
      useAbsolute: true,
      cache: "no-store",
    });
  } catch (error) {
    console.error("Erro ao buscar ticket:", error);
    notFound();
  }

  if (!ticket) {
    notFound();
  }

  return <EditTicketClient ticket={ticket} />;
}

