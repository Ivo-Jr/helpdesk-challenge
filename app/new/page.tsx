"use client";

import { useRouter } from "next/navigation";
import { useTicketStore } from "@/stores/ticket-store";
import { useTicketMutation } from "@/hooks/use-ticket-mutation";
import type { CreateTicketDto } from "@/types/ticket";
import { TicketForm } from "@/components/ticket-form/TicketForm";
import styles from "./page.module.scss";

export default function NewTicketPage() {
  const router = useRouter();
  const createTicket = useTicketStore((state) => state.createTicket);
  const { mutate, isLoading, error, isSuccess } = useTicketMutation({
    onSuccess: () => router.push("/"),
  });

  const handleSubmit = async (data: CreateTicketDto) => {
    mutate(() => createTicket(data));
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Novo Ticket</h1>
        <p>Preencha os dados para criar um novo ticket de suporte</p>
      </div>

      <TicketForm
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        error={error}
        success={isSuccess}
        onCancel={handleCancel}
      />
    </main>
  );
}
