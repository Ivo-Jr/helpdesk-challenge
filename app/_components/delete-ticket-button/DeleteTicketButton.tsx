"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTicketStore } from "@/stores/ticket-store";
import { useTicketMutation } from "@/hooks/use-ticket-mutation";
import styles from "./DeleteTicketButton.module.scss";

interface DeleteTicketButtonProps {
  ticketId: string;
}

export function DeleteTicketButton({ ticketId }: DeleteTicketButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const deleteTicketAsync = useTicketStore((state) => state.deleteTicketAsync);
  const { mutate, isLoading: isDeleting, error, reset } = useTicketMutation({
    onSuccess: () => {
      setShowModal(false);
      router.push("/?deleted=true");
    },
  });

  const handleDelete = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    mutate(() => deleteTicketAsync(ticketId));
  };

  const handleCancel = () => {
    if (isDeleting || isProcessing) return;
    setShowModal(false);
    reset();
  };

  const isDisabled = isDeleting || isProcessing;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={styles.deleteButton}
        disabled={isDisabled}
      >
        Excluir Ticket
      </button>

      {showModal && (
        <div 
          className={styles.modalOverlay} 
          onClick={handleCancel}
          style={{ pointerEvents: isDisabled ? 'none' : 'auto' }}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Confirmar exclusão</h2>
              <button
                onClick={handleCancel}
                className={styles.closeButton}
                disabled={isDisabled}
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
                disabled={isDisabled}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className={styles.confirmButton}
                disabled={isDisabled}
              >
                {isDisabled ? (
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