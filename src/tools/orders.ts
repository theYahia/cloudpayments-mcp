import { z } from "zod";
import { getClient } from "../client.js";

export const createOrderSchema = z.object({
  Amount: z.number().positive().describe("Payment amount"),
  Currency: z.string().default("RUB").describe("Currency (RUB, USD, EUR, etc.)"),
  Description: z.string().describe("Order description shown to the payer"),
  Email: z.string().email().optional().describe("Payer email for receipt"),
  RequireConfirmation: z.boolean().default(false).describe("true = two-step payment"),
  SendEmail: z.boolean().default(false).describe("Send payment link to the email automatically"),
  InvoiceId: z.string().optional().describe("Order number in your system"),
  AccountId: z.string().optional().describe("User identifier in your system"),
  Phone: z.string().optional().describe("Payer phone number"),
  JsonData: z.string().optional().describe("Extra data as JSON string"),
});

export const listTransactionsSchema = z.object({
  Date: z.string().describe("Date to list transactions for (YYYY-MM-DD format)"),
  TimeZone: z.string().default("UTC").describe("Timezone for the date filter (e.g. UTC, MSK)"),
});

export async function handleCreateOrder(params: z.infer<typeof createOrderSchema>): Promise<string> {
  const result = await getClient().post("/orders/create", { ...params });
  return JSON.stringify(result, null, 2);
}

export async function handleListTransactions(params: z.infer<typeof listTransactionsSchema>): Promise<string> {
  const result = await getClient().post("/payments/list", {
    Date: params.Date,
    TimeZone: params.TimeZone,
  });
  return JSON.stringify(result, null, 2);
}
