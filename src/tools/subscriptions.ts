import { z } from "zod";
import { getClient } from "../client.js";

export const createSubscriptionSchema = z.object({
  Token: z.string().describe("Recurring token from a previous payment (Transaction.Token)"),
  AccountId: z.string().describe("User identifier in your system"),
  Description: z.string().describe("Subscription description"),
  Email: z.string().email().optional().describe("Subscriber email for receipts"),
  Amount: z.number().positive().describe("Charge amount per period"),
  Currency: z.string().default("RUB").describe("Currency (RUB, USD, EUR, etc.)"),
  RequireConfirmation: z.boolean().default(false).describe("true = two-step charges (auth then confirm)"),
  StartDate: z.string().describe("First charge date (ISO 8601, e.g. 2026-05-01T00:00:00)"),
  Interval: z.enum(["Day", "Week", "Month"]).describe("Billing interval unit"),
  Period: z.number().int().positive().describe("Billing interval length (e.g. 1 Month = monthly, 7 Day = weekly)"),
  MaxPeriods: z.number().int().positive().optional().describe("Max number of billing periods (optional, unlimited if omitted)"),
});

export const updateSubscriptionSchema = z.object({
  Id: z.string().describe("Subscription ID to update"),
  Description: z.string().optional().describe("New description"),
  Amount: z.number().positive().optional().describe("New charge amount"),
  Currency: z.string().optional().describe("New currency"),
  RequireConfirmation: z.boolean().optional().describe("Change two-step mode"),
  Interval: z.enum(["Day", "Week", "Month"]).optional().describe("New billing interval"),
  Period: z.number().int().positive().optional().describe("New billing period"),
  MaxPeriods: z.number().int().positive().optional().describe("New max periods"),
});

export const cancelSubscriptionSchema = z.object({
  Id: z.string().describe("Subscription ID to cancel"),
});

export const listSubscriptionsSchema = z.object({
  AccountId: z.string().describe("User ID to list subscriptions for"),
});

export async function handleCreateSubscription(params: z.infer<typeof createSubscriptionSchema>): Promise<string> {
  const result = await getClient().post("/subscriptions/create", { ...params });
  return JSON.stringify(result, null, 2);
}

export async function handleUpdateSubscription(params: z.infer<typeof updateSubscriptionSchema>): Promise<string> {
  const result = await getClient().post("/subscriptions/update", { ...params });
  return JSON.stringify(result, null, 2);
}

export async function handleCancelSubscription(params: z.infer<typeof cancelSubscriptionSchema>): Promise<string> {
  const result = await getClient().post("/subscriptions/cancel", { ...params });
  return JSON.stringify(result, null, 2);
}

export async function handleListSubscriptions(params: z.infer<typeof listSubscriptionsSchema>): Promise<string> {
  const result = await getClient().post("/subscriptions/find", { ...params });
  return JSON.stringify(result, null, 2);
}
