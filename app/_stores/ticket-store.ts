import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Ticket, CreateTicketDto, UpdateTicketDto } from "../_types/ticket";
import { ticketApi } from "../_lib/api";

interface TicketStore {
  // Estado
  tickets: Ticket[];
  ticketCache: Map<string, Ticket>;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    search?: string;
  };
  
  lastFetch: number | null;
  cacheEnabled: boolean;
  
  getTicketById: (id: string) => Ticket | undefined;
  getFilteredTickets: () => Ticket[];
  
  setTickets: (tickets: Ticket[]) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (id: string, data: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<TicketStore["filters"]>) => void;
  clearFilters: () => void;
  
  fetchTickets: (filters?: { status?: string; search?: string }) => Promise<void>;
  fetchTicketById: (id: string, forceRefresh?: boolean) => Promise<Ticket>;
  createTicket: (data: CreateTicketDto) => Promise<Ticket>;
  updateTicketAsync: (id: string, data: UpdateTicketDto) => Promise<Ticket>;
  deleteTicketAsync: (id: string) => Promise<void>;
  
  enableCache: () => void;
  disableCache: () => void;
  clearCache: () => void;
  invalidateCache: (id?: string) => void;
}

export const useTicketStore = create<TicketStore>()(
  devtools(
    (set, get) => ({
      tickets: [],
      ticketCache: new Map(),
      loading: false,
      error: null,
      filters: {},
      lastFetch: null,
      cacheEnabled: false,
      
      getTicketById: (id) => {
        const cache = get().ticketCache;
        return cache.get(id) || get().tickets.find(t => t.id === id);
      },
      
      getFilteredTickets: () => {
        const { tickets, filters } = get();
        let filtered = [...tickets];
        
        if (filters.status) {
          filtered = filtered.filter(t => t.status === filters.status);
        }
        
        if (filters.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(search)
          );
        }
        
        return filtered;
      },
      
      setTickets: (tickets) => {
        const cache = new Map(get().ticketCache);
        tickets.forEach(ticket => cache.set(ticket.id, ticket));
        
        set({ 
          tickets, 
          ticketCache: cache,
          error: null,
          lastFetch: Date.now()
        });
      },
      
      addTicket: (ticket) => {
        const cache = new Map(get().ticketCache);
        cache.set(ticket.id, ticket);
        
        set((state) => ({
          tickets: [ticket, ...state.tickets],
          ticketCache: cache,
        }));
      },
      
      updateTicket: (id, data) => {
        const cache = new Map(get().ticketCache);
        const existing = cache.get(id);
        if (existing) {
          cache.set(id, { ...existing, ...data });
        }
        
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === id ? { ...ticket, ...data } : ticket
          ),
          ticketCache: cache,
        }));
      },
      
      deleteTicket: (id) => {
        const cache = new Map(get().ticketCache);
        cache.delete(id);
        
        set((state) => ({
          tickets: state.tickets.filter((ticket) => ticket.id !== id),
          ticketCache: cache,
        }));
      },
      
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
      })),
      clearFilters: () => set({ filters: {} }),
      
      fetchTickets: async (filters) => {
        set({ loading: true, error: null });
        
        try {
          const tickets = await ticketApi.getAll(filters);
          get().setTickets(tickets);
          set({ loading: false });
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : "Erro ao buscar tickets",
            loading: false 
          });
        }
      },
      
      fetchTicketById: async (id, forceRefresh = false) => {
        const { cacheEnabled, ticketCache } = get();
        
        if (cacheEnabled && !forceRefresh && ticketCache.has(id)) {
          return ticketCache.get(id)!;
        }
        
        set({ loading: true, error: null });
        
        try {
          const ticket = await ticketApi.getById(id);
          
          const cache = new Map(ticketCache);
          cache.set(id, ticket);
          
          set({ 
            ticketCache: cache,
            loading: false 
          });
          
          return ticket;
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : "Erro ao buscar ticket",
            loading: false 
          });
          throw err;
        }
      },
      
      createTicket: async (data) => {
        set({ loading: true, error: null });
        
        try {
          const ticket = await ticketApi.create(data);
          get().addTicket(ticket);
          set({ loading: false });
          return ticket;
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : "Erro ao criar ticket",
            loading: false 
          });
          throw err;
        }
      },
      
      updateTicketAsync: async (id, data) => {
        set({ loading: true, error: null });
        
        try {
          const ticket = await ticketApi.update(id, data);
          get().updateTicket(id, ticket);
          set({ loading: false });
          return ticket;
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : "Erro ao atualizar ticket",
            loading: false 
          });
          throw err;
        }
      },
      
      deleteTicketAsync: async (id) => {
        set({ loading: true, error: null });
        
        try {
          await ticketApi.delete(id);
          get().deleteTicket(id);
          set({ loading: false });
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : "Erro ao excluir ticket",
            loading: false 
          });
          throw err;
        }
      },
      
      enableCache: () => set({ cacheEnabled: true }),
      disableCache: () => set({ cacheEnabled: false }),
      clearCache: () => set({ 
        ticketCache: new Map(),
        lastFetch: null 
      }),
      invalidateCache: (id) => {
        if (id) {
          const cache = new Map(get().ticketCache);
          cache.delete(id);
          set({ ticketCache: cache });
        } else {
          get().clearCache();
        }
      },
    }),
    { name: "TicketStore" }
  )
);
