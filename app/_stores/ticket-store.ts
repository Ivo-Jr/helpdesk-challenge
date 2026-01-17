import { create } from "zustand";
import type { Ticket } from "../_types/ticket";

interface TicketStore {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    search?: string;
  };
  setTickets: (tickets: Ticket[]) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (id: string, data: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<TicketStore["filters"]>) => void;
  clearFilters: () => void;
}

export const useTicketStore = create<TicketStore>((set) => ({
  tickets: [],
  loading: false,
  error: null,
  filters: {},

  setTickets: (tickets) => set({ tickets, error: null }),

  addTicket: (ticket) =>
    set((state) => ({
      tickets: [ticket, ...state.tickets],
    })),

  updateTicket: (id, data) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, ...data } : ticket
      ),
    })),

  deleteTicket: (id) =>
    set((state) => ({
      tickets: state.tickets.filter((ticket) => ticket.id !== id),
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error, loading: false }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  clearFilters: () => set({ filters: {} }),
}));
