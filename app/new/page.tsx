"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ticketApi } from "@/lib/api";
import type {
  CreateTicketDto,
  TicketCategory,
  TicketPriority,
} from "@/types/ticket";
import { PRIORITY_LABELS, CATEGORY_LABELS } from "@/lib/constants";
import styles from "./page.module.scss";

export default function NewTicketPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para cada campo
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [category, setCategory] = useState<TicketCategory>("other");
  const [attachmentUrl, setAttachmentUrl] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const data: CreateTicketDto = {
        title,
        description,
        email,
        priority,
        category,
        status: "open", // Sempre inicia como "open"
        attachmentUrl: attachmentUrl || undefined,
      };

      await ticketApi.create(data);

      // Redirecionar para home após sucesso
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar ticket");
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Novo Ticket</h1>
        <p>Preencha os dados para criar um novo ticket de suporte</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label htmlFor="title">Título *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Descrição *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="priority">Prioridade *</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
              required
              disabled={isSubmitting}
            >
              <option value="low">{PRIORITY_LABELS.low}</option>
              <option value="medium">{PRIORITY_LABELS.medium}</option>
              <option value="high">{PRIORITY_LABELS.high}</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="category">Categoria *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TicketCategory)}
              required
              disabled={isSubmitting}
            >
              <option value="bug">{CATEGORY_LABELS.bug}</option>
              <option value="billing">{CATEGORY_LABELS.billing}</option>
              <option value="feature">{CATEGORY_LABELS.feature}</option>
              <option value="other">{CATEGORY_LABELS.other}</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="attachmentUrl">URL do Anexo (opcional)</label>
          <input
            id="attachmentUrl"
            type="url"
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
            placeholder="https://exemplo.com/arquivo.pdf"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => router.push("/")}
            disabled={isSubmitting}
            className={styles.cancelButton}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? "Criando..." : "Criar Ticket"}
          </button>
        </div>
      </form>
    </main>
  );
}
