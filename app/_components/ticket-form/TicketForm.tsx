"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateTicketDto, Ticket } from "@/types/ticket";
import { ticketSchema } from "@/lib/validations";
import { PRIORITY_LABELS, CATEGORY_LABELS } from "@/lib/constants";
import styles from "./TicketForm.module.scss";

interface TicketFormProps {
  onSubmit: (data: CreateTicketDto) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  success?: boolean;
  onCancel: () => void;
  initialValues?: Ticket;
  mode?: "create" | "edit";
}

export function TicketForm({
  onSubmit,
  isSubmitting,
  error,
  success,
  onCancel,
  initialValues,
  mode = "create",
}: TicketFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTicketDto>({
    resolver: zodResolver(ticketSchema),
    defaultValues: initialValues || {
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
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={styles.form}>
      {error && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.success}>
          <span className={styles.successIcon}>✓</span>
          {mode === "edit" 
            ? "Ticket atualizado com sucesso! Redirecionando..." 
            : "Ticket criado com sucesso! Redirecionando..."}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="title">Título *</label>
        <input
          id="title"
          type="text"
          {...register("title")}
          disabled={isSubmitting}
          className={errors.title ? styles.inputError : ""}
        />
        {errors.title && (
          <span className={styles.fieldError}>{errors.title.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="description">Descrição *</label>
        <textarea
          id="description"
          {...register("description")}
          rows={5}
          disabled={isSubmitting}
          className={errors.description ? styles.inputError : ""}
        />
        {errors.description && (
          <span className={styles.fieldError}>{errors.description.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          disabled={isSubmitting}
          className={errors.email ? styles.inputError : ""}
        />
        {errors.email && (
          <span className={styles.fieldError}>{errors.email.message}</span>
        )}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="priority">Prioridade *</label>
          <select
            id="priority"
            {...register("priority")}
            disabled={isSubmitting}
            className={errors.priority ? styles.inputError : ""}
          >
            <option value="low">{PRIORITY_LABELS.low}</option>
            <option value="medium">{PRIORITY_LABELS.medium}</option>
            <option value="high">{PRIORITY_LABELS.high}</option>
          </select>
          {errors.priority && (
            <span className={styles.fieldError}>{errors.priority.message}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="category">Categoria *</label>
          <select
            id="category"
            {...register("category")}
            disabled={isSubmitting}
            className={errors.category ? styles.inputError : ""}
          >
            <option value="bug">{CATEGORY_LABELS.bug}</option>
            <option value="billing">{CATEGORY_LABELS.billing}</option>
            <option value="feature">{CATEGORY_LABELS.feature}</option>
            <option value="other">{CATEGORY_LABELS.other}</option>
          </select>
          {errors.category && (
            <span className={styles.fieldError}>{errors.category.message}</span>
          )}
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
          className={errors.attachmentUrl ? styles.inputError : ""}
        />
        {errors.attachmentUrl && (
          <span className={styles.fieldError}>{errors.attachmentUrl.message}</span>
        )}
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
          {isSubmitting ? (
            <>
              <span className={styles.spinner}></span>
              {mode === "edit" ? "Salvando..." : "Criando..."}
            </>
          ) : (
            mode === "edit" ? "Salvar Alterações" : "Criar Ticket"
          )}
        </button>
      </div>
    </form>
  );
}
