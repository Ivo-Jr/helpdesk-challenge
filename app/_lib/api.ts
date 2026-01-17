import type {
  Ticket,
  CreateTicketDto,
  UpdateTicketDto,
} from "../_types/ticket";

const API_BASE_URL = "/api/tickets";

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
  async getAll(filters?: {
    status?: string;
    search?: string;
  }): Promise<Ticket[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.search) params.append("search", filters.search);

    const url = params.toString() ? `${API_BASE_URL}?${params}` : API_BASE_URL;
    const response = await fetch(url, { cache: "no-store" });
    return handleResponse<Ticket[]>(response);
  },

  async getById(id: string): Promise<Ticket> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      cache: "no-store",
    });
    return handleResponse<Ticket>(response);
  },

  async create(data: CreateTicketDto): Promise<Ticket> {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Ticket>(response);
  },

  async update(id: string, data: UpdateTicketDto): Promise<Ticket> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Ticket>(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
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
