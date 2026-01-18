import { notFound } from "next/navigation";
import Link from "next/link";
import type { Ticket } from "@/types/ticket";
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  CATEGORY_LABELS,
} from "@/lib/constants";
import { formatDate } from "@/lib/formatters";
import styles from "./page.module.scss";

// Função para buscar ticket por ID
async function getTicket(id: string): Promise<Ticket | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/tickets/${id}`, {
      cache: "no-store", // SSR - sempre buscar dados frescos
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error("Falha ao buscar ticket");
    }

    return res.json();
  } catch (error) {
    console.error("Erro ao buscar ticket:", error);
    return null;
  }
}

type Params = Promise<{ id: string }>;

export default async function TicketDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const ticket = await getTicket(id);

  if (!ticket) {
    notFound();
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Voltar para listagem
        </Link>
        <h1 className={styles.title}>{ticket.title}</h1>
      </div>

      <div className={styles.content}>
        {/* Badges */}
        <div className={styles.badges}>
          <span className={`${styles.badge} ${styles[`badge-${ticket.status}`]}`}>
            {STATUS_LABELS[ticket.status]}
          </span>
          <span className={`${styles.badge} ${styles[`badge-priority-${ticket.priority}`]}`}>
            {PRIORITY_LABELS[ticket.priority]}
          </span>
          <span className={`${styles.badge} ${styles.badgeCategory}`}>
            {CATEGORY_LABELS[ticket.category]}
          </span>
        </div>

        {/* Descrição */}
        <section className={styles.section}>
          <h2>Descrição</h2>
          <p className={styles.description}>{ticket.description}</p>
        </section>

        {/* Informações */}
        <section className={styles.section}>
          <h2>Informações</h2>
          <dl className={styles.infoList}>
            <div className={styles.infoItem}>
              <dt>Email do solicitante</dt>
              <dd>{ticket.email}</dd>
            </div>
            <div className={styles.infoItem}>
              <dt>Data de criação</dt>
              <dd>{formatDate(ticket.createdAt)}</dd>
            </div>
            {ticket.attachmentUrl && (
              <div className={styles.infoItem}>
                <dt>Anexo</dt>
                <dd>
                  <a
                    href={ticket.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.attachmentLink}
                  >
                    Ver anexo →
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </section>

        {/* Ações */}
        <div className={styles.actions}>
          <Link href={`/tickets/${ticket.id}/edit`} className={styles.editButton}>
            Editar Ticket
          </Link>
        </div>
      </div>
    </main>
  );
}

