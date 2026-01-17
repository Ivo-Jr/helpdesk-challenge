export type TicketPriority = "low" | "medium" | "high";
export type TicketStatus = "open" | "in_progress" | "resolved";
export type TicketCategory = "bug" | "billing" | "feature" | "other";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  email: string;
  priority: TicketPriority;
  category: TicketCategory;
  status: TicketStatus;
  attachmentUrl?: string;
  createdAt: string;
}

export type CreateTicketDto = Omit<Ticket, "id" | "createdAt">;
export type UpdateTicketDto = Partial<CreateTicketDto>;
