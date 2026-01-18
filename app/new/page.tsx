"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ticketApi } from "@/lib/api";
import type { CreateTicketDto } from "@/types/ticket";
import { TicketForm } from "@/components/ticket-form/TicketForm";
import styles from "./page.module.scss";

export default function NewTicketPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateTicketDto) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await ticketApi.create(data);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar ticket");
      setIsSubmitting(false);
    }
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
        isSubmitting={isSubmitting}
        error={error}
        onCancel={handleCancel}
      />
    </main>
  );
}
