"use client";

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
        <h1>Erro ao Carregar Tickets</h1>
        <p>Ocorreu um erro ao buscar os tickets.</p>
      </div>
      <div className={styles.emptyState}>
        <p>{error.message}</p>
        <button onClick={() => reset()}>Tentar novamente</button>
      </div>
    </main>
  );
}
