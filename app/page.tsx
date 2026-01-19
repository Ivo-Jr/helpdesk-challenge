import styles from "./page.module.scss";
import { TicketCard } from "@/components/ticket-card/TicketCard";
import { TicketFilters } from "@/components/ticket-filters/TicketFilters";
import { ticketApi } from "./_lib/api";

// ISR: Revalidar a cada 60 segundos
export const revalidate = 60;

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

  const tickets = await ticketApi.getAll(filters, {
    useAbsolute: true,
    next: { revalidate: 60 },
  });

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Tickets de Suporte</h1>
        <p>Gerencie seus tickets de suporte</p>
      </div>

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
