"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Ticket, CreateTicketDto } from "@/types/ticket";
import { TicketForm } from "@/components/ticket-form/TicketForm";
import styles from "./page.module.scss";

interface EditTicketClientProps {
  ticket: Ticket;
}

export function EditTicketClient({ ticket }: EditTicketClientProps) {
  const router = useRouter();
  const [isSubmitting] = useState(false);
  const [error] = useState<string | null>(null);

  // Placeholder: submit será implementado depois
  const handleSubmit = async (data: CreateTicketDto) => {
    console.log("Submit será implementado na próxima etapa:", data);
    // TODO: Implementar ticketApi.update()
  };

  const handleCancel = () => {
    router.push(`/tickets/${ticket.id}`);
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Ticket</h1>
        <p>Atualize as informações do ticket #{ticket.id.slice(0, 8)}</p>
      </div>

      <TicketForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
        onCancel={handleCancel}
        initialValues={ticket}
        mode="edit"
      />
    </main>
  );
}

