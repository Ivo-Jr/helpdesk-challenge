"use client";

import { useRouter } from "next/navigation";
import { useTicketStore } from "@/stores/ticket-store";
import { useTicketMutation } from "@/hooks/use-ticket-mutation";
import type { Ticket, CreateTicketDto } from "@/types/ticket";
import { TicketForm } from "@/components/ticket-form/TicketForm";
import styles from "./page.module.scss";

interface EditTicketClientProps {
  ticket: Ticket;
}

export function EditTicketClient({ ticket }: EditTicketClientProps) {
  const router = useRouter();
  const updateTicketAsync = useTicketStore((state) => state.updateTicketAsync);
  const { mutate, isLoading, error, isSuccess } = useTicketMutation({
    onSuccess: () => router.push(`/tickets/${ticket.id}`),
  });

  const handleSubmit = async (data: CreateTicketDto) => {
    mutate(() => updateTicketAsync(ticket.id, data));
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
        isSubmitting={isLoading}
        error={error}
        success={isSuccess}
        onCancel={handleCancel}
        initialValues={ticket}
        mode="edit"
      />
    </main>
  );
}

