"use client";

import Link from "next/link";
import styles from "./page.module.scss";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Tickets de Suporte</h1>
        <p>Algo deu errado</p>
      </div>

      <div className={styles.errorState}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2>Erro ao Carregar Tickets</h2>
        <p className={styles.errorMessage}>
          Não foi possível buscar os tickets. {error.message}
        </p>
        <div className={styles.errorActions}>
          <button onClick={() => reset()} className={styles.primaryButton}>
            Tentar Novamente
          </button>
          <Link href="/" className={styles.secondaryButton}>
            Voltar ao Início
          </Link>
        </div>
      </div>
    </main>
  );
}
