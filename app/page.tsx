import type { Ticket } from "@/types/ticket";
import styles from "./page.module.scss";
import { TicketCard } from "@/components/ticket-card/TicketCard";
import { TicketFilters } from "@/components/ticket-filters/TicketFilters";

// ISR: Revalidar a cada 60 segundos
export const revalidate = 60;

// Função para buscar tickets do servidor
async function getTickets(filters?: {
  status?: string;
  search?: string;
}): Promise<Ticket[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.search) params.append("search", filters.search);

    const url = params.toString()
      ? `http://localhost:3000/api/tickets?${params}`
      : "http://localhost:3000/api/tickets";

    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Falha ao buscar tickets");
    }

    return res.json();
  } catch (error) {
    console.error("Erro ao buscar tickets:", error);
    throw error;
  }
}

// Tipagem do searchParams (Next.js 16 é Promise)
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const filters = {
    status: typeof params.status === "string" ? params.status : undefined,
    search: typeof params.search === "string" ? params.search : undefined,
  };

  const tickets = await getTickets(filters);

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Tickets de Suporte</h1>
        <p>Gerencie seus tickets de suporte</p>
      </div>

      {/* Componente de filtros */}
      <TicketFilters />

      {tickets.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h2>Nenhum ticket encontrado</h2>
          <p>Nenhum ticket corresponde aos filtros aplicados.</p>
          <p className={styles.emptyHint}>
            Tente ajustar os filtros ou criar um novo ticket.
          </p>
        </div>
      ) : (
        <ul className={styles.ticketList}>
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <TicketCard ticket={ticket} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
