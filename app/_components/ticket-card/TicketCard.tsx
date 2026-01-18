import Link from "next/link";
import type { Ticket } from "@/types/ticket";
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  CATEGORY_LABELS,
} from "@/lib/constants";
import { formatDate } from "@/lib/formatters";
import styles from "./TicketCard.module.scss";

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Link href={`/tickets/${ticket.id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <h3 className={styles.title}>{ticket.title}</h3>
        <div className={styles.meta}>
          <span>Status: {STATUS_LABELS[ticket.status]}</span>
          <span>Prioridade: {PRIORITY_LABELS[ticket.priority]}</span>
          <span>Categoria: {CATEGORY_LABELS[ticket.category]}</span>
        </div>
        <p className={styles.description}>{ticket.description}</p>
        <small className={styles.footer}>
          {ticket.email} • {formatDate(ticket.createdAt)}
        </small>
      </article>
    </Link>
  );
}
