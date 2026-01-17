import type { Ticket } from "@/types/ticket";
import styles from "./page.module.scss";
import { TicketCard } from "@/components/ticket-card/TicketCard";

// ISR: Revalidar a cada 60 segundos
export const revalidate = 60;

// Função para buscar tickets do servidor
async function getTickets(): Promise<Ticket[]> {
  try {
    const res = await fetch("http://localhost:3000/api/tickets", {
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

export default async function HomePage() {
  const tickets = await getTickets();

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Tickets de Suporte</h1>
        <p>Gerencie seus tickets de suporte</p>
      </div>

      {tickets.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h2>Nenhum ticket encontrado</h2>
          <p>Ainda não há tickets de suporte cadastrados.</p>
          <p className={styles.emptyHint}>
            Crie seu primeiro ticket para começar a gerenciar suas solicitações.
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
