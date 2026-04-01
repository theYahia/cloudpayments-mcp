import { z } from "zod";
import { getClient } from "../client.js";
import type { Transaction } from "../types.js";

// --- Schemas ---

export const chargeSchema = z.object({
  Amount: z.number().positive().describe("Сумма платежа"),
  Currency: z.string().default("RUB").describe("Валюта (RUB, USD, EUR и др.)"),
  IpAddress: z.string().describe("IP-адрес плательщика"),
  CardCryptogramPacket: z.string().describe("Криптограмма карты (из виджета CloudPayments)"),
  Name: z.string().optional().describe("Имя держателя карты"),
  InvoiceId: z.string().optional().describe("Номер заказа в вашей системе"),
  Description: z.string().optional().describe("Описание платежа"),
  AccountId: z.string().optional().describe("Идентификатор пользователя"),
  Email: z.string().optional().describe("Email для отправки чека"),
  JsonData: z.string().optional().describe("Дополнительные данные (JSON-строка)"),
});

export const authSchema = z.object({
  Amount: z.number().positive().describe("Сумма авторизации (холдирования)"),
  Currency: z.string().default("RUB").describe("Валюта"),
  IpAddress: z.string().describe("IP-адрес плательщика"),
  CardCryptogramPacket: z.string().describe("Криптограмма карты"),
  Name: z.string().optional().describe("Имя держателя карты"),
  InvoiceId: z.string().optional().describe("Номер заказа"),
  Description: z.string().optional().describe("Описание платежа"),
  AccountId: z.string().optional().describe("Идентификатор пользователя"),
  Email: z.string().optional().describe("Email для чека"),
  JsonData: z.string().optional().describe("Дополнительные данные (JSON-строка)"),
});

export const confirmSchema = z.object({
  TransactionId: z.number().int().positive().describe("ID транзакции для подтверждения"),
  Amount: z.number().positive().describe("Сумма подтверждения (можно меньше авторизованной)"),
  JsonData: z.string().optional().describe("Дополнительные данные (JSON-строка)"),
});

export const voidSchema = z.object({
  TransactionId: z.number().int().positive().describe("ID транзакции для отмены"),
});

export const getTransactionSchema = z.object({
  TransactionId: z.number().int().positive().describe("ID транзакции"),
});

// --- Handlers ---

export async function handleCharge(params: z.infer<typeof chargeSchema>): Promise<string> {
  const body: Record<string, unknown> = { ...params };
  const result = await getClient().post<Transaction>("/payments/charge", body);
  return JSON.stringify(result, null, 2);
}

export async function handleAuth(params: z.infer<typeof authSchema>): Promise<string> {
  const body: Record<string, unknown> = { ...params };
  const result = await getClient().post<Transaction>("/payments/auth", body);
  return JSON.stringify(result, null, 2);
}

export async function handleConfirm(params: z.infer<typeof confirmSchema>): Promise<string> {
  const body: Record<string, unknown> = { ...params };
  const result = await getClient().post("/payments/confirm", body);
  return JSON.stringify(result, null, 2);
}

export async function handleVoid(params: z.infer<typeof voidSchema>): Promise<string> {
  const body: Record<string, unknown> = { ...params };
  const result = await getClient().post("/payments/void", body);
  return JSON.stringify(result, null, 2);
}

export async function handleGetTransaction(params: z.infer<typeof getTransactionSchema>): Promise<string> {
  const body: Record<string, unknown> = { ...params };
  const result = await getClient().post<Transaction>("/payments/find", body);
  return JSON.stringify(result, null, 2);
}
