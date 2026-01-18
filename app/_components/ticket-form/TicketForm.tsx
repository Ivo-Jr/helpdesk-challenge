"use client";

import { useForm } from "react-hook-form";
import type { CreateTicketDto } from "@/types/ticket";
import { PRIORITY_LABELS, CATEGORY_LABELS } from "@/lib/constants";
import styles from "./TicketForm.module.scss";

interface TicketFormProps {
  onSubmit: (data: CreateTicketDto) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  onCancel: () => void;
}

export function TicketForm({
  onSubmit,
  isSubmitting,
  error,
  onCancel,
}: TicketFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTicketDto>({
    defaultValues: {
      title: "",
      description: "",
      email: "",
      priority: "medium",
      category: "other",
      status: "open",
      attachmentUrl: "",
    },
  });

  const onFormSubmit = async (data: CreateTicketDto) => {
    // Remove attachmentUrl vazio
    const payload = {
      ...data,
      attachmentUrl: data.attachmentUrl || undefined,
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.field}>
        <label htmlFor="title">Título *</label>
        <input
          id="title"
          type="text"
          {...register("title", { required: true })}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="description">Descrição *</label>
        <textarea
          id="description"
          {...register("description", { required: true })}
          rows={5}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          {...register("email", { required: true })}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="priority">Prioridade *</label>
          <select
            id="priority"
            {...register("priority", { required: true })}
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
            {...register("category", { required: true })}
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
          {...register("attachmentUrl")}
          placeholder="https://exemplo.com/arquivo.pdf"
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
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
  );
}

