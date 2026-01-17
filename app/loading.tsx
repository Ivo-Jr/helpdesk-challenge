import styles from "./page.module.scss";

export default function Loading() {
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Tickets de Suporte</h1>
        <p>Carregando tickets...</p>
      </div>

      <div className={styles.ticketList}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.skeleton}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonMeta}>
              <div className={styles.skeletonBadge}></div>
              <div className={styles.skeletonBadge}></div>
              <div className={styles.skeletonBadge}></div>
            </div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonFooter}></div>
          </div>
        ))}
      </div>
    </main>
  );
}
