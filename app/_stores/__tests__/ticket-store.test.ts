import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useTicketStore } from '../ticket-store';
import { ticketApi } from '../../_lib/api';
import type { Ticket } from '../../_types/ticket';

vi.mock('../../_lib/api');

describe('useTicketStore', () => {
  beforeEach(() => {
    useTicketStore.getState().clearCache();
    useTicketStore.setState({
      tickets: [],
      error: null,
      loading: false,
      filters: {},
      cacheEnabled: false,
      lastFetch: null,
      ticketCache: new Map(),
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Actions Síncronas', () => {
    it('deve adicionar ticket ao store', () => {
      const { result } = renderHook(() => useTicketStore());
      const mockTicket: Ticket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test description',
        email: 'test@example.com',
        priority: 'medium',
        category: 'bug',
        status: 'open',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      act(() => {
        result.current.addTicket(mockTicket);
      });

      expect(result.current.tickets).toHaveLength(1);
      expect(result.current.tickets[0]).toEqual(mockTicket);
      expect(result.current.ticketCache.get('1')).toEqual(mockTicket);
    });

    it('deve atualizar ticket existente', () => {
      const { result } = renderHook(() => useTicketStore());
      const mockTicket: Ticket = {
        id: '1',
        title: 'Original',
        description: 'Test',
        email: 'test@example.com',
        priority: 'medium',
        category: 'bug',
        status: 'open',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      act(() => {
        result.current.addTicket(mockTicket);
        result.current.updateTicket('1', { title: 'Updated' });
      });

      expect(result.current.tickets[0].title).toBe('Updated');
      expect(result.current.ticketCache.get('1')?.title).toBe('Updated');
    });

    it('deve remover ticket', () => {
      const { result } = renderHook(() => useTicketStore());
      const mockTicket: Ticket = {
        id: '1',
        title: 'Test',
        description: 'Test',
        email: 'test@example.com',
        priority: 'medium',
        category: 'bug',
        status: 'open',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      act(() => {
        result.current.addTicket(mockTicket);
        result.current.deleteTicket('1');
      });

      expect(result.current.tickets).toHaveLength(0);
      expect(result.current.ticketCache.has('1')).toBe(false);
    });

    it('deve definir múltiplos tickets', () => {
      const { result } = renderHook(() => useTicketStore());
      const mockTickets: Ticket[] = [
        {
          id: '1',
          title: 'Ticket 1',
          description: 'Test',
          email: 'test@example.com',
          priority: 'medium',
          category: 'bug',
          status: 'open',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Ticket 2',
          description: 'Test',
          email: 'test@example.com',
          priority: 'high',
          category: 'feature',
          status: 'resolved',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      act(() => {
        result.current.setTickets(mockTickets);
      });

      expect(result.current.tickets).toHaveLength(2);
      expect(result.current.ticketCache.size).toBe(2);
      expect(result.current.lastFetch).not.toBeNull();
    });

    it('deve limpar erro ao definir tickets', () => {
      const { result } = renderHook(() => useTicketStore());

      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.setTickets([]);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Actions Assíncronas', () => {
    it('deve buscar tickets da API', async () => {
      const mockTickets: Ticket[] = [{
        id: '1',
        title: 'Test',
        description: 'Test',
        email: 'test@example.com',
        priority: 'medium',
        category: 'bug',
        status: 'open',
        createdAt: '2024-01-01T00:00:00.000Z',
      }];
      vi.mocked(ticketApi.getAll).mockResolvedValueOnce(mockTickets);

      const { result } = renderHook(() => useTicketStore());

      await act(async () => {
        await result.current.fetchTickets();
      });

      expect(result.current.tickets).toEqual(mockTickets);
      expect(result.current.loading).toBe(false);
    });

    it('deve buscar tickets com filtros', async () => {
      const mockTickets: Ticket[] = [];
      vi.mocked(ticketApi.getAll).mockResolvedValueOnce(mockTickets);

      const { result } = renderHook(() => useTicketStore());

      await act(async () => {
        await result.current.fetchTickets({ status: 'open', search: 'bug' });
      });

      expect(ticketApi.getAll).toHaveBeenCalledWith({ status: 'open', search: 'bug' });
    });

    it('deve criar ticket via API e adicionar ao store', async () => {
      const newTicket: Ticket = {
        id: '2',
        title: 'New',
        description: 'Test',
        email: 'test@example.com',
        priority: 'high',
        category: 'feature',
        status: 'open',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      vi.mocked(ticketApi.create).mockResolvedValueOnce(newTicket);

      const { result } = renderHook(() => useTicketStore());

      await act(async () => {
        await result.current.createTicket({
          title: 'New',
          description: 'Test',
          email: 'test@example.com',
          priority: 'high',
          category: 'feature',
          status: 'open',
        });
      });

      expect(result.current.tickets).toContainEqual(newTicket);
    });

    it('deve atualizar ticket via API', async () => {
      const updatedTicket: Ticket = {
        id: '1',
        title: 'Updated',
        description: 'Test',
        email: 'test@example.com',
        priority: 'medium',
        category: 'bug',
        status: 'resolved',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      vi.mocked(ticketApi.update).mockResolvedValueOnce(updatedTicket);

      const { result } = renderHook(() => useTicketStore());

      act(() => {
        result.current.addTicket({
          id: '1',
          title: 'Original',
          description: 'Test',
          email: 'test@example.com',
          priority: 'medium',
          category: 'bug',
          status: 'open',
          createdAt: '2024-01-01T00:00:00.000Z',
        });
      });

      await act(async () => {
        await result.current.updateTicketAsync('1', { title: 'Updated', status: 'resolved' });
      });

      expect(result.current.tickets[0].title).toBe('Updated');
      expect(result.current.tickets[0].status).toBe('resolved');
    });

    it('deve deletar ticket via API', async () => {
      vi.mocked(ticketApi.delete).mockResolvedValueOnce();

      const { result } = renderHook(() => useTicketStore());

      act(() => {
        result.current.addTicket({
          id: '1',
          title: 'To Delete',
          description: 'Test',
          email: 'test@example.com',
          priority: 'medium',
          category: 'bug',
          status: 'open',
          createdAt: '2024-01-01T00:00:00.000Z',
        });
      });

      await act(async () => {
        await result.current.deleteTicketAsync('1');
      });

      expect(result.current.tickets).toHaveLength(0);
    });

    it('deve gerenciar erro em fetch', async () => {
      vi.mocked(ticketApi.getAll).mockRejectedValueOnce(
        new Error('API Error')
      );

      const { result } = renderHook(() => useTicketStore());

      await act(async () => {
        await result.current.fetchTickets();
      });

      expect(result.current.error).toBe('API Error');
      expect(result.current.loading).toBe(false);
    });

    it('deve gerenciar erro genérico em fetch', async () => {
      vi.mocked(ticketApi.getAll).mockRejectedValueOnce('Unknown error');

      const { result } = renderHook(() => useTicketStore());

      await act(async () => {
        await result.current.fetchTickets();
      });

      expect(result.current.error).toBe('Erro ao buscar tickets');
    });

    it('deve gerenciar erro em create', async () => {
      vi.mocked(ticketApi.create).mockRejectedValueOnce(new Error('Create failed'));

      const { result } = renderHook(() => useTicketStore());

      await expect(async () => {
        await act(async () => {
          await result.current.createTicket({
            title: 'Test',
            description: 'Test',
            email: 'test@example.com',
            priority: 'medium',
            category: 'bug',
            status: 'open',
          });
        });
      }).rejects.toThrow('Create failed');

      expect(result.current.error).toBe('Create failed');
    });

    it('deve gerenciar erro em update', async () => {
      vi.mocked(ticketApi.update).mockRejectedValueOnce(new Error('Update failed'));

      const { result } = renderHook(() => useTicketStore());

      await expect(async () => {
        await act(async () => {
          await result.current.updateTicketAsync('1', { title: 'Updated' });
        });
      }).rejects.toThrow('Update failed');

      expect(result.current.error).toBe('Update failed');
    });

    it('deve gerenciar erro em delete', async () => {
      vi.mocked(ticketApi.delete).mockRejectedValueOnce(new Error('Delete failed'));

      const { result } = renderHook(() => useTicketStore());

      await expect(async () => {
        await act(async () => {
          await result.current.deleteTicketAsync('1');
        });
      }).rejects.toThrow('Delete failed');

      expect(result.current.error).toBe('Delete failed');
    });
  });

  describe('Cache', () => {
    it('deve usar cache quando habilitado', async () => {
      const mockTicket: Ticket = {
        id: '1',
        title: 'Cached',
        description: 'Test',
        email: 'test@example.com',
        priority: 'medium',
        category: 'bug',
        status: 'open',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      vi.mocked(ticketApi.getById).mockResolvedValueOnce(mockTicket);

      const { result } = renderHook(() => useTicketStore());

      act(() => {
        result.current.enableCache();
      });

      await act(async () => {
        await result.current.fetchTicketById('1');
      });

      expect(ticketApi.getById).toHaveBeenCalledTimes(1);

      await act(async () => {
        await result.current.fetchTicketById('1');
      });

      expect(ticketApi.getById).toHaveBeenCalledTimes(1);
    });

    it('deve forçar refresh quando solicitado', async () => {
      const mockTicket: Ticket = {
        id: '1',
        title: 'Test',
        description: 'Test',
        email: 'test@example.com',
        priority: 'medium',
        category: 'bug',
        status: 'open',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      vi.mocked(ticketApi.getById).mockResolvedValue(mockTicket);

      const { result } = renderHook(() => useTicketStore());

      act(() => {
        result.current.enableCache();
      });

      await act(async () => {
        await result.current.fetchTicketById('1');
      });

      expect(ticketApi.getById).toHaveBeenCalledTimes(1);

      await act(async () => {
        await result.current.fetchTicketById('1', true);
      });

      expect(ticketApi.getById).toHaveBeenCalledTimes(2);
    });

    it('deve buscar da API quando cache desabilitado', async () => {
      const mockTicket: Ticket = {
        id: '1',
        title: 'Test',
        description: 'Test',
        email: 'test@example.com',
        priority: 'medium',
        category: 'bug',
        status: 'open',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      vi.mocked(ticketApi.getById).mockResolvedValue(mockTicket);

      const { result } = renderHook(() => useTicketStore());

      await act(async () => {
        await result.current.fetchTicketById('1');
      });

      expect(ticketApi.getById).toHaveBeenCalledTimes(1);

      await act(async () => {
        await result.current.fetchTicketById('1');
      });

      expect(ticketApi.getById).toHaveBeenCalledTimes(2);
    });

    it('deve invalidar cache específico', () => {
      const { result } = renderHook(() => useTicketStore());
      
      act(() => {
        result.current.addTicket({
          id: '1',
          title: 'Test',
          description: 'Test',
          email: 'test@example.com',
          priority: 'medium',
          category: 'bug',
          status: 'open',
          createdAt: '2024-01-01T00:00:00.000Z',
        });
        result.current.invalidateCache('1');
      });

      expect(result.current.ticketCache.has('1')).toBe(false);
    });

    it('deve limpar todo cache', () => {
      const { result } = renderHook(() => useTicketStore());
      
      act(() => {
        result.current.setTickets([
          {
            id: '1',
            title: 'Test 1',
            description: 'Test',
            email: 'test@example.com',
            priority: 'medium',
            category: 'bug',
            status: 'open',
            createdAt: '2024-01-01T00:00:00.000Z',
          },
          {
            id: '2',
            title: 'Test 2',
            description: 'Test',
            email: 'test@example.com',
            priority: 'high',
            category: 'feature',
            status: 'resolved',
            createdAt: '2024-01-02T00:00:00.000Z',
          },
        ]);
      });

      expect(result.current.ticketCache.size).toBe(2);

      act(() => {
        result.current.clearCache();
      });

      expect(result.current.ticketCache.size).toBe(0);
      expect(result.current.lastFetch).toBeNull();
    });

    it('deve invalidar todo cache quando ID não fornecido', () => {
      const { result } = renderHook(() => useTicketStore());
      
      act(() => {
        result.current.setTickets([
          {
            id: '1',
            title: 'Test',
            description: 'Test',
            email: 'test@example.com',
            priority: 'medium',
            category: 'bug',
            status: 'open',
            createdAt: '2024-01-01T00:00:00.000Z',
          },
        ]);
        result.current.invalidateCache();
      });

      expect(result.current.ticketCache.size).toBe(0);
    });
  });

  describe('Filtros', () => {
    it('deve filtrar tickets por status', () => {
      const { result } = renderHook(() => useTicketStore());

      act(() => {
        result.current.setTickets([
          {
            id: '1',
            status: 'open',
            title: 'A',
            description: 'Test',
            email: 'test@example.com',
            priority: 'medium',
            category: 'bug',
            createdAt: '2024-01-01T00:00:00.000Z',
          },
          {
            id: '2',
            status: 'resolved',
            title: 'B',
            description: 'Test',
            email: 'test@example.com',
            priority: 'high',
            category: 'feature',
            createdAt: '2024-01-02T00:00:00.000Z',
          },
        ]);
        result.current.setFilters({ status: 'open' });
      });

      const filtered = result.current.getFilteredTickets();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });

    it('deve buscar tickets por título', () => {
      const { result } = renderHook(() => useTicketStore());

      act(() => {
        result.current.setTickets([
          {
            id: '1',
            title: 'Bug no sistema',
            status: 'open',
            description: 'Test',
            email: 'test@example.com',
            priority: 'medium',
            category: 'bug',
            createdAt: '2024-01-01T00:00:00.000Z',
          },
          {
            id: '2',
            title: 'Feature request',
            status: 'open',
            description: 'Test',
            email: 'test@example.com',
            priority: 'high',
            category: 'feature',
            createdAt: '2024-01-02T00:00:00.000Z',
          },
        ]);
        result.current.setFilters({ search: 'bug' });
      });

      const filtered = result.current.getFilteredTickets();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });

    it('deve buscar tickets case-insensitive', () => {
      const { result } = renderHook(() => useTicketStore());

      act(() => {
        result.current.setTickets([
          {
            id: '1',
            title: 'BUG no Sistema',
            status: 'open',
            description: 'Test',
            email: 'test@example.com',
            priority: 'medium',
            category: 'bug',
            createdAt: '2024-01-01T00:00:00.000Z',
          },
        ]);
        result.current.setFilters({ search: 'bug' });
      });

      const filtered = result.current.getFilteredTickets();
      expect(filtered).toHaveLength(1);
    });

    it('deve aplicar múltiplos filtros', () => {
      const { result } = renderHook(() => useTicketStore());

      act(() => {
        result.current.setTickets([
          {
            id: '1',
            title: 'Bug no sistema',
            status: 'open',
            description: 'Test',
            email: 'test@example.com',
            priority: 'medium',
            category: 'bug',
            createdAt: '2024-01-01T00:00:00.000Z',
          },
          {
            id: '2',
            title: 'Bug resolvido',
            status: 'resolved',
            description: 'Test',
            email: 'test@example.com',
            priority: 'high',
            category: 'bug',
            createdAt: '2024-01-02T00:00:00.000Z',
          },
          {
            id: '3',
            title: 'Feature aberta',
            status: 'open',
            description: 'Test',
            email: 'test@example.com',
            priority: 'low',
            category: 'feature',
            createdAt: '2024-01-03T00:00:00.000Z',
          },
        ]);
        result.current.setFilters({ status: 'open', search: 'bug' });
      });

      const filtered = result.current.getFilteredTickets();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });

    it('deve limpar filtros', () => {
      const { result } = renderHook(() => useTicketStore());

      act(() => {
        result.current.setFilters({ status: 'open', search: 'bug' });
      });

      expect(result.current.filters.status).toBe('open');
      expect(result.current.filters.search).toBe('bug');

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters.status).toBeUndefined();
      expect(result.current.filters.search).toBeUndefined();
    });

    it('deve retornar todos tickets sem filtros', () => {
      const { result } = renderHook(() => useTicketStore());

      act(() => {
        result.current.setTickets([
          {
            id: '1',
            title: 'A',
            status: 'open',
            description: 'Test',
            email: 'test@example.com',
            priority: 'medium',
            category: 'bug',
            createdAt: '2024-01-01T00:00:00.000Z',
          },
          {
            id: '2',
            title: 'B',
            status: 'resolved',
            description: 'Test',
            email: 'test@example.com',
            priority: 'high',
            category: 'feature',
            createdAt: '2024-01-02T00:00:00.000Z',
          },
        ]);
      });

      const filtered = result.current.getFilteredTickets();
      expect(filtered).toHaveLength(2);
    });
  });

  describe('Getters', () => {
    it('deve buscar ticket por ID do cache', () => {
      const { result } = renderHook(() => useTicketStore());
      
      act(() => {
        result.current.addTicket({
          id: '1',
          title: 'Test',
          description: 'Test',
          email: 'test@example.com',
          priority: 'medium',
          category: 'bug',
          status: 'open',
          createdAt: '2024-01-01T00:00:00.000Z',
        });
      });

      const ticket = result.current.getTicketById('1');
      expect(ticket).toBeDefined();
      expect(ticket?.id).toBe('1');
    });

    it('deve retornar undefined para ID inexistente', () => {
      const { result } = renderHook(() => useTicketStore());
      
      const ticket = result.current.getTicketById('999');
      expect(ticket).toBeUndefined();
    });

    it('deve buscar ticket da lista se não estiver no cache', () => {
      const { result } = renderHook(() => useTicketStore());
      
      act(() => {
        result.current.setTickets([
          {
            id: '1',
            title: 'Test',
            description: 'Test',
            email: 'test@example.com',
            priority: 'medium',
            category: 'bug',
            status: 'open',
            createdAt: '2024-01-01T00:00:00.000Z',
          },
        ]);
        result.current.clearCache();
      });

      const ticket = result.current.getTicketById('1');
      expect(ticket).toBeDefined();
    });
  });

  describe('Estados', () => {
    it('deve gerenciar estado de loading', () => {
      const { result } = renderHook(() => useTicketStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.loading).toBe(false);
    });

    it('deve gerenciar estado de erro', () => {
      const { result } = renderHook(() => useTicketStore());

      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');
      expect(result.current.loading).toBe(false);
    });

    it('deve habilitar e desabilitar cache', () => {
      const { result } = renderHook(() => useTicketStore());

      expect(result.current.cacheEnabled).toBe(false);

      act(() => {
        result.current.enableCache();
      });

      expect(result.current.cacheEnabled).toBe(true);

      act(() => {
        result.current.disableCache();
      });

      expect(result.current.cacheEnabled).toBe(false);
    });
  });
});