import type { Ticket } from "@/types/ticket";
import styles from "./page.module.scss";
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "./_lib/constants";

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

// Helper para formatar data
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
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
          <p>Nenhum ticket encontrado.</p>
          <p>Crie seu primeiro ticket de suporte.</p>
        </div>
      ) : (
        <ul className={styles.ticketList}>
          {tickets.map((ticket) => (
            <li key={ticket.id} className={styles.ticketItem}>
              <h3>{ticket.title}</h3>
              <div className={styles.meta}>
                <span>Status: {STATUS_LABELS[ticket.status]}</span>
                <span>Prioridade: {PRIORITY_LABELS[ticket.priority]}</span>
                <span>Categoria: {CATEGORY_LABELS[ticket.category]}</span>
              </div>
              <p>{ticket.description}</p>
              <small>
                {ticket.email} • {formatDate(ticket.createdAt)}
              </small>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
