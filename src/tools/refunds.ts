import { z } from "zod";
import { getClient } from "../client.js";

export const refundSchema = z.object({
  TransactionId: z.number().int().positive().describe("ID транзакции для возврата"),
  Amount: z.number().positive().describe("Сумма возврата (полная или частичная)"),
  JsonData: z.string().optional().describe("Дополнительные данные (JSON-строка)"),
});

export async function handleRefund(params: z.infer<typeof refundSchema>): Promise<string> {
  const body: Record<string, unknown> = { ...params };
  const result = await getClient().post("/payments/refund", body);
  return JSON.stringify(result, null, 2);
}
