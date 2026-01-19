"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ticketApi } from "@/lib/api";
import styles from "./DeleteTicketButton.module.scss";

interface DeleteTicketButtonProps {
  ticketId: string;
}

export function DeleteTicketButton({ ticketId }: DeleteTicketButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      await ticketApi.delete(ticketId);
      setShowModal(false);
      router.push("/?deleted=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir ticket");
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setError(null);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={styles.deleteButton}
        disabled={isDeleting}
      >
        Excluir Ticket
      </button>

      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCancel}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Confirmar exclusão</h2>
              <button
                onClick={handleCancel}
                className={styles.closeButton}
                disabled={isDeleting}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalDescription}>
                Tem certeza que deseja excluir este ticket? Esta ação não pode ser desfeita.
              </p>

              {error && (
                <div className={styles.error}>
                  <span className={styles.errorIcon}>⚠️</span>
                  {error}
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={handleCancel}
                className={styles.cancelButton}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className={styles.confirmButton}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className={styles.spinner}></span>
                    Excluindo...
                  </>
                ) : (
                  "Confirmar Exclusão"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

