"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Ticket, CreateTicketDto } from "@/types/ticket";
import { TicketForm } from "@/components/ticket-form/TicketForm";
import { ticketApi } from "@/lib/api";
import styles from "./page.module.scss";

interface EditTicketClientProps {
  ticket: Ticket;
}

export function EditTicketClient({ ticket }: EditTicketClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: CreateTicketDto) => {
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await ticketApi.update(ticket.id, data);
      setSuccess(true);
      
      setTimeout(() => {
        router.push(`/tickets/${ticket.id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar ticket");
      setIsSubmitting(false);
    }
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
        success={success}
        onCancel={handleCancel}
        initialValues={ticket}
        mode="edit"
      />
    </main>
  );
}

