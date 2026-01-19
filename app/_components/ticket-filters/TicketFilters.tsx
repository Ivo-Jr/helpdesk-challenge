"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useTicketStore } from "@/stores/ticket-store";
import { STATUS_LABELS } from "@/lib/constants";
import styles from "./TicketFilters.module.scss";

export function TicketFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const setFilters = useTicketStore((state) => state.setFilters);
  const clearFiltersStore = useTicketStore((state) => state.clearFilters);

  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    if (status) params.set("status", status);
    if (search) params.set("search", search);

    setFilters({ status: status || undefined, search: search || undefined });

    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}` : "/";

    startTransition(() => {
      router.push(newUrl);
    });
  };

  const handleClearFilters = () => {
    setStatus("");
    setSearch("");
    clearFiltersStore();
    
    startTransition(() => {
      router.push("/");
    });
  };

  const hasActiveFilters = status || search;

  return (
    <div className={styles.filters}>
      <div className={styles.filterGroup}>
        <label htmlFor="status-filter" className={styles.label}>
          Status
        </label>
        <select
          id="status-filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={styles.select}
          disabled={isPending}
        >
          <option value="">Todos</option>
          <option value="open">{STATUS_LABELS.open}</option>
          <option value="in_progress">{STATUS_LABELS.in_progress}</option>
          <option value="resolved">{STATUS_LABELS.resolved}</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="search-filter" className={styles.label}>
          Buscar
        </label>
        <input
          id="search-filter"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleApplyFilters();
          }}
          placeholder="Buscar por título..."
          className={styles.input}
          disabled={isPending}
        />
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleApplyFilters}
          disabled={isPending}
          className={styles.applyButton}
        >
          {isPending ? "Aplicando..." : "Aplicar Filtros"}
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            disabled={isPending}
            className={styles.clearButton}
          >
            Limpar Filtros
          </button>
        )}
      </div>
    </div>
  );
}
