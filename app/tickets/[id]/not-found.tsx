import Link from "next/link";
import styles from "./page.module.scss";

export default function TicketNotFound() {
  return (
    <main className={styles.container}>
      <div className={styles.notFound}>
        <div className={styles.notFoundIcon}>🔍</div>
        <h1>Ticket não encontrado</h1>
        <p>O ticket que você está procurando não existe ou foi removido.</p>
        <Link href="/" className={styles.backButton}>
          Voltar para listagem
        </Link>
      </div>
    </main>
  );
}

