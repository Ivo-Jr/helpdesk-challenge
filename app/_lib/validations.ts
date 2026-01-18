import { z } from "zod";
import { PUBLIC_EMAIL_DOMAINS } from "./constants";

export const ticketSchema = z
  .object({
    title: z.string().min(5, "Título deve ter no mínimo 5 caracteres"),
    description: z
      .string()
      .min(20, "Descrição deve ter no mínimo 20 caracteres"),
    email: z.string().email("E-mail inválido"),
    priority: z
      .union([z.literal("low"), z.literal("medium"), z.literal("high")])
      .refine(() => true, {
        message: "Prioridade inválida",
      }),
    category: z.union([
      z.literal("bug"),
      z.literal("billing"),
      z.literal("feature"),
      z.literal("other"),
    ]),
    status: z
      .union([
        z.literal("open"),
        z.literal("in_progress"),
        z.literal("resolved"),
      ]),
    attachmentUrl: z
      .string()
      .url("URL inválida")
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val)),
  })
  .refine(
    (data) => {
      // Validação condicional 1: billing não aceita domínios públicos
      if (data.category === "billing") {
        const domain = data.email.split("@")[1];
        return !PUBLIC_EMAIL_DOMAINS.includes(domain);
      }
      return true;
    },
    {
      message: "Para tickets de cobrança, use um e-mail corporativo",
      path: ["email"],
    }
  )
  .refine(
    (data) => {
      // Validação condicional 2: high priority exige descrição longa
      if (data.priority === "high") {
        return data.description.length >= 60;
      }
      return true;
    },
    {
      message:
        "Tickets de alta prioridade exigem descrição com mínimo de 60 caracteres",
      path: ["description"],
    }
  )
  .refine(
    (data) => {
      // Validação condicional 3: bug exige [BUG] no título
      if (data.category === "bug") {
        return data.title.startsWith("[BUG]");
      }
      return true;
    },
    {
      message: "Tickets de bug devem começar com [BUG] no título",
      path: ["title"],
    }
  );

export type TicketFormData = z.infer<typeof ticketSchema>;
