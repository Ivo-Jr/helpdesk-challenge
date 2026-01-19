import type {
  Ticket,
  CreateTicketDto,
  UpdateTicketDto,
} from "../_types/ticket";
import { getBaseUrl } from "./config";

/**
 * Constrói URL completa para requisições
 * @param useAbsolute - Se true, retorna URL absoluta (necessário em Server Components)
 */
function getApiUrl(useAbsolute = false): string {
  if (useAbsolute) {
    return `${getBaseUrl()}/api/tickets`;
  }
  return "/api/tickets";
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Erro desconhecido" }));
    throw new Error(error.error || "Erro na requisição");
  }
  return response.json();
}

export const ticketApi = {
  /**
   * Busca todos os tickets com filtros opcionais
   * @param filters - Filtros de status e busca
   * @param options - Opções de cache do Next.js
   */
  async getAll(
    filters?: {
      status?: string;
      search?: string;
    },
    options?: {
      useAbsolute?: boolean;
      cache?: RequestCache;
      next?: NextFetchRequestConfig;
    }
  ): Promise<Ticket[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.search) params.append("search", filters.search);

    const baseUrl = getApiUrl(options?.useAbsolute);
    const url = params.toString() ? `${baseUrl}?${params}` : baseUrl;

    const response = await fetch(url, {
      cache: options?.cache || "no-store",
      next: options?.next,
    });
    return handleResponse<Ticket[]>(response);
  },

  /**
   * Busca um ticket por ID
   * @param id - ID do ticket
   * @param options - Opções de cache do Next.js
   */
  async getById(
    id: string,
    options?: {
      useAbsolute?: boolean;
      cache?: RequestCache;
      next?: NextFetchRequestConfig;
    }
  ): Promise<Ticket> {
    const baseUrl = getApiUrl(options?.useAbsolute);
    const response = await fetch(`${baseUrl}/${id}`, {
      cache: options?.cache || "no-store",
      next: options?.next,
    });
    return handleResponse<Ticket>(response);
  },

  async create(data: CreateTicketDto): Promise<Ticket> {
    const response = await fetch(getApiUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Ticket>(response);
  },

  async update(id: string, data: UpdateTicketDto): Promise<Ticket> {
    const response = await fetch(`${getApiUrl()}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Ticket>(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${getApiUrl()}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Erro ao excluir ticket" }));
      throw new Error(error.error || "Erro ao excluir ticket");
    }
  },
};