"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTicketStore } from "../_stores/ticket-store";
import { useTicketMutation } from "../_hooks/use-ticket-mutation";
import type { CreateTicketDto } from "../_types/ticket";
import { TicketForm } from "../_components/ticket-form/TicketForm";
import styles from "./page.module.scss";

export default function NewTicketPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const createTicket = useTicketStore((state) => state.createTicket);
  const { mutate, isLoading, error, isSuccess } = useTicketMutation({
    onSuccess: () => {
      router.push("/");
    },
  });

  const handleSubmit = async (data: CreateTicketDto) => {
    if (isProcessing) return;
    setIsProcessing(true);
    await mutate(() => createTicket(data));
  };

  const handleCancel = () => {
    if (isLoading || isProcessing) return;
    router.push("/");
  };

  const isSubmitting = isLoading || isProcessing;

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Novo Ticket</h1>
        <p>Preencha os dados para criar um novo ticket de suporte</p>
      </div>

      <TicketForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
        success={isSuccess}
        onCancel={handleCancel}
      />
    </main>
  );
}