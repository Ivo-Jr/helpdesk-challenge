import styles from "./page.module.scss";

export default function Loading() {
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Tickets de Suporte</h1>
        <p>Carregando tickets...</p>
      </div>
    </main>
  );
}
