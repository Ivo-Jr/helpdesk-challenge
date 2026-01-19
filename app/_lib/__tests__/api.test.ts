import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ticketApi } from '../api';
import type { Ticket, CreateTicketDto, UpdateTicketDto } from '../../_types/ticket';
import * as config from '../config';

describe('ticketApi', () => {
  // Mock de fetch
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  // Ticket de exemplo para testes
  const mockTicket: Ticket = {
    id: 'ticket-123',
    title: 'Test Ticket',
    description: 'Test description with more than 20 characters',
    email: 'test@example.com',
    priority: 'medium',
    category: 'bug',
    status: 'open',
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    // Mock de fetch antes de cada teste
    fetchSpy = vi.spyOn(global, 'fetch');
    // Mock de getBaseUrl para retornar URL consistente
    vi.spyOn(config, 'getBaseUrl').mockReturnValue('http://localhost:3000');
  });

  afterEach(() => {
    // Restaurar mocks após cada teste
    vi.restoreAllMocks();
  });

  describe('getAll', () => {
    it('deve buscar todos os tickets sem filtros', async () => {
      const mockTickets: Ticket[] = [mockTicket];
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTickets,
      } as Response);

      const result = await ticketApi.getAll();

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith('/api/tickets', {
        cache: 'no-store',
        next: undefined,
      });
      expect(result).toEqual(mockTickets);
    });

    it('deve buscar tickets com filtro de status', async () => {
      const mockTickets: Ticket[] = [mockTicket];
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTickets,
      } as Response);

      const result = await ticketApi.getAll({ status: 'open' });

      expect(fetchSpy).toHaveBeenCalledWith('/api/tickets?status=open', {
        cache: 'no-store',
        next: undefined,
      });
      expect(result).toEqual(mockTickets);
    });

    it('deve buscar tickets com filtro de search', async () => {
      const mockTickets: Ticket[] = [mockTicket];
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTickets,
      } as Response);

      const result = await ticketApi.getAll({ search: 'bug' });

      expect(fetchSpy).toHaveBeenCalledWith('/api/tickets?search=bug', {
        cache: 'no-store',
        next: undefined,
      });
      expect(result).toEqual(mockTickets);
    });

    it('deve buscar tickets com múltiplos filtros', async () => {
      const mockTickets: Ticket[] = [mockTicket];
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTickets,
      } as Response);

      const result = await ticketApi.getAll({
        status: 'open',
        search: 'bug',
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        '/api/tickets?status=open&search=bug',
        {
          cache: 'no-store',
          next: undefined,
        }
      );
      expect(result).toEqual(mockTickets);
    });

    it('deve usar URL absoluta quando useAbsolute=true', async () => {
      const mockTickets: Ticket[] = [mockTicket];
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTickets,
      } as Response);

      await ticketApi.getAll(undefined, { useAbsolute: true });

      expect(fetchSpy).toHaveBeenCalledWith(
        'http://localhost:3000/api/tickets',
        {
          cache: 'no-store',
          next: undefined,
        }
      );
    });

    it('deve usar opções de cache customizadas', async () => {
      const mockTickets: Ticket[] = [mockTicket];
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTickets,
      } as Response);

      await ticketApi.getAll(undefined, {
        cache: 'force-cache',
        next: { revalidate: 60 },
      });

      expect(fetchSpy).toHaveBeenCalledWith('/api/tickets', {
        cache: 'force-cache',
        next: { revalidate: 60 },
      });
    });

    it('deve retornar array vazio quando API retorna vazio', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      const result = await ticketApi.getAll();

      expect(result).toEqual([]);
    });

    it('deve lançar erro quando response não é ok', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Erro ao buscar tickets' }),
      } as Response);

      await expect(ticketApi.getAll()).rejects.toThrow('Erro ao buscar tickets');
    });

    it('deve lançar erro genérico quando json() falha', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as Response);

      await expect(ticketApi.getAll()).rejects.toThrow('Erro desconhecido');
    });
  });

  describe('getById', () => {
    it('deve buscar ticket por ID', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTicket,
      } as Response);

      const result = await ticketApi.getById('ticket-123');

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith('/api/tickets/ticket-123', {
        cache: 'no-store',
        next: undefined,
      });
      expect(result).toEqual(mockTicket);
    });

    it('deve usar URL absoluta quando useAbsolute=true', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTicket,
      } as Response);

      await ticketApi.getById('ticket-123', { useAbsolute: true });

      expect(fetchSpy).toHaveBeenCalledWith(
        'http://localhost:3000/api/tickets/ticket-123',
        {
          cache: 'no-store',
          next: undefined,
        }
      );
    });

    it('deve usar opções de cache customizadas', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTicket,
      } as Response);

      await ticketApi.getById('ticket-123', {
        cache: 'force-cache',
        next: { revalidate: 30 },
      });

      expect(fetchSpy).toHaveBeenCalledWith('/api/tickets/ticket-123', {
        cache: 'force-cache',
        next: { revalidate: 30 },
      });
    });

    it('deve lançar erro quando ticket não existe (404)', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Ticket não encontrado' }),
      } as Response);

      await expect(ticketApi.getById('invalid-id')).rejects.toThrow(
        'Ticket não encontrado'
      );
    });

    it('deve lançar erro genérico em caso de erro do servidor', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Server error');
        },
      } as Response);

      await expect(ticketApi.getById('ticket-123')).rejects.toThrow(
        'Erro desconhecido'
      );
    });
  });

  describe('create', () => {
    const createDto: CreateTicketDto = {
      title: '[BUG] New ticket',
      description: 'Description with more than 20 characters',
      email: 'user@example.com',
      priority: 'high',
      category: 'bug',
      status: 'open',
    };

    it('deve criar um novo ticket', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTicket,
      } as Response);

      const result = await ticketApi.create(createDto);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createDto),
      });
      expect(result).toEqual(mockTicket);
    });

    it('deve enviar dados corretos no body', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTicket,
      } as Response);

      await ticketApi.create(createDto);

      const callArgs = fetchSpy.mock.calls[0];
      const body = JSON.parse(callArgs[1]?.body as string);

      expect(body).toEqual(createDto);
      expect(body.title).toBe('[BUG] New ticket');
      expect(body.priority).toBe('high');
    });

    it('deve incluir header Content-Type correto', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTicket,
      } as Response);

      await ticketApi.create(createDto);

      const callArgs = fetchSpy.mock.calls[0];
      expect(callArgs[1]?.headers).toEqual({
        'Content-Type': 'application/json',
      });
    });

    it('deve lançar erro quando validação falha (400)', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Dados inválidos' }),
      } as Response);

      await expect(ticketApi.create(createDto)).rejects.toThrow(
        'Dados inválidos'
      );
    });

    it('deve lançar erro quando servidor falha (500)', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Erro ao criar ticket' }),
      } as Response);

      await expect(ticketApi.create(createDto)).rejects.toThrow(
        'Erro ao criar ticket'
      );
    });

    it('deve lidar com attachmentUrl opcional', async () => {
      const dtoWithAttachment: CreateTicketDto = {
        ...createDto,
        attachmentUrl: 'https://example.com/file.pdf',
      };

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTicket,
      } as Response);

      await ticketApi.create(dtoWithAttachment);

      const callArgs = fetchSpy.mock.calls[0];
      const body = JSON.parse(callArgs[1]?.body as string);
      expect(body.attachmentUrl).toBe('https://example.com/file.pdf');
    });
  });

  describe('update', () => {
    const updateDto: UpdateTicketDto = {
      title: 'Updated title',
      status: 'resolved',
    };

    it('deve atualizar um ticket existente', async () => {
      const updatedTicket = { ...mockTicket, ...updateDto };
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedTicket,
      } as Response);

      const result = await ticketApi.update('ticket-123', updateDto);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith('/api/tickets/ticket-123', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateDto),
      });
      expect(result).toEqual(updatedTicket);
    });

    it('deve permitir atualização parcial', async () => {
      const partialUpdate: UpdateTicketDto = { status: 'in_progress' };
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockTicket, status: 'in_progress' }),
      } as Response);

      await ticketApi.update('ticket-123', partialUpdate);

      const callArgs = fetchSpy.mock.calls[0];
      const body = JSON.parse(callArgs[1]?.body as string);
      expect(body).toEqual(partialUpdate);
      expect(Object.keys(body)).toHaveLength(1);
    });

    it('deve usar método PATCH', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTicket,
      } as Response);

      await ticketApi.update('ticket-123', updateDto);

      const callArgs = fetchSpy.mock.calls[0];
      expect(callArgs[1]?.method).toBe('PATCH');
    });

    it('deve lançar erro quando ticket não existe (404)', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Ticket não encontrado' }),
      } as Response);

      await expect(ticketApi.update('invalid-id', updateDto)).rejects.toThrow(
        'Ticket não encontrado'
      );
    });

    it('deve lançar erro quando validação falha', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Dados inválidos' }),
      } as Response);

      await expect(ticketApi.update('ticket-123', updateDto)).rejects.toThrow(
        'Dados inválidos'
      );
    });

    it('deve incluir Content-Type header', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTicket,
      } as Response);

      await ticketApi.update('ticket-123', updateDto);

      const callArgs = fetchSpy.mock.calls[0];
      expect(callArgs[1]?.headers).toEqual({
        'Content-Type': 'application/json',
      });
    });
  });

  describe('delete', () => {
    it('deve deletar um ticket existente', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
      } as Response);

      await ticketApi.delete('ticket-123');

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith('/api/tickets/ticket-123', {
        method: 'DELETE',
      });
    });

    it('deve usar método DELETE', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
      } as Response);

      await ticketApi.delete('ticket-123');

      const callArgs = fetchSpy.mock.calls[0];
      expect(callArgs[1]?.method).toBe('DELETE');
    });

    it('não deve retornar nada em caso de sucesso', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
      } as Response);

      const result = await ticketApi.delete('ticket-123');

      expect(result).toBeUndefined();
    });

    it('deve lançar erro quando ticket não existe (404)', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Ticket não encontrado' }),
      } as Response);

      await expect(ticketApi.delete('invalid-id')).rejects.toThrow(
        'Ticket não encontrado'
      );
    });

    it('deve lançar erro genérico quando json() falha', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Parse error');
        },
      } as Response);

      await expect(ticketApi.delete('ticket-123')).rejects.toThrow(
        'Erro ao excluir ticket'
      );
    });

    it('deve lançar erro com mensagem específica', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Sem permissão para excluir' }),
      } as Response);

      await expect(ticketApi.delete('ticket-123')).rejects.toThrow(
        'Sem permissão para excluir'
      );
    });
  });

  describe('Error Handling', () => {
    it('deve tratar erro de rede (fetch rejeitado)', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('Network error'));

      await expect(ticketApi.getAll()).rejects.toThrow('Network error');
    });

    it('deve tratar timeout', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('Request timeout'));

      await expect(ticketApi.getById('ticket-123')).rejects.toThrow(
        'Request timeout'
      );
    });

    it('deve tratar JSON inválido na resposta de sucesso', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as Response);

      await expect(ticketApi.getAll()).rejects.toThrow('Invalid JSON');
    });

    it('deve preservar mensagem de erro da API', async () => {
      const customError = 'Erro personalizado da API';
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: customError }),
      } as Response);

      await expect(ticketApi.getAll()).rejects.toThrow(customError);
    });

    it('deve usar mensagem padrão quando API não retorna error field', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Something went wrong' }),
      } as Response);

      await expect(ticketApi.getAll()).rejects.toThrow('Erro na requisição');
    });
  });

  describe('Integration Scenarios', () => {
    it('deve fazer múltiplas chamadas independentes', async () => {
      fetchSpy
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [mockTicket],
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTicket,
        } as Response);

      await ticketApi.getAll();
      await ticketApi.getById('ticket-123');

      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it('deve lidar com chamadas sequenciais (create -> getById)', async () => {
      const createdTicket = { ...mockTicket, id: 'new-ticket' };

      fetchSpy
        .mockResolvedValueOnce({
          ok: true,
          json: async () => createdTicket,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => createdTicket,
        } as Response);

      const created = await ticketApi.create({
        title: '[BUG] Test',
        description: 'Test description with more than 20 chars',
        email: 'test@example.com',
        priority: 'medium',
        category: 'bug',
        status: 'open',
      });

      const fetched = await ticketApi.getById(created.id);

      expect(created.id).toBe('new-ticket');
      expect(fetched.id).toBe('new-ticket');
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it('deve lidar com update -> getById', async () => {
      const updatedTicket = { ...mockTicket, status: 'resolved' as const };

      fetchSpy
        .mockResolvedValueOnce({
          ok: true,
          json: async () => updatedTicket,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => updatedTicket,
        } as Response);

      await ticketApi.update('ticket-123', { status: 'resolved' });
      const fetched = await ticketApi.getById('ticket-123');

      expect(fetched.status).toBe('resolved');
    });
  });
});

