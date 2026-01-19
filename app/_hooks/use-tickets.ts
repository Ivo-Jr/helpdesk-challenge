import { useTicketStore } from "../_stores/ticket-store";
import { useEffect } from "react";

interface UseTicketsOptions {
  autoFetch?: boolean;
  filters?: {
    status?: string;
    search?: string;
  };
}

export function useTickets(options?: UseTicketsOptions) {
  const tickets = useTicketStore((state) => state.getFilteredTickets());
  const loading = useTicketStore((state) => state.loading);
  const error = useTicketStore((state) => state.error);
  const fetchTickets = useTicketStore((state) => state.fetchTickets);
  const setFilters = useTicketStore((state) => state.setFilters);

  useEffect(() => {
    if (options?.autoFetch) {
      fetchTickets(options.filters);
    }
  }, [options?.autoFetch, options?.filters, fetchTickets]);

  useEffect(() => {
    if (options?.filters) {
      setFilters(options.filters);
    }
  }, [options?.filters, setFilters]);

  return { tickets, loading, error, refetch: fetchTickets };
}

