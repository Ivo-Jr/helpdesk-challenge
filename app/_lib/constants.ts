export const TICKET_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
} as const;

export const TICKET_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export const TICKET_CATEGORY = {
  BUG: "bug",
  BILLING: "billing",
  FEATURE: "feature",
  OTHER: "other",
} as const;

export const PUBLIC_EMAIL_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "yahoo.com",
  "outlook.com",
];

export const STATUS_LABELS: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em Progresso",
  resolved: "Resolvido",
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

export const CATEGORY_LABELS: Record<string, string> = {
  bug: "Bug",
  billing: "Cobrança",
  feature: "Feature",
  other: "Outro",
};
