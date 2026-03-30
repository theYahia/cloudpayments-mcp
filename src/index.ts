#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  chargeSchema, handleCharge,
  authSchema, handleAuth,
  confirmSchema, handleConfirm,
  voidSchema, handleVoid,
  getTransactionSchema, handleGetTransaction,
} from "./tools/payments.js";
import {
  refundSchema, handleRefund,
} from "./tools/refunds.js";

const server = new McpServer({
  name: "cloudpayments-mcp",
  version: "1.0.0",
});

// Платежи
server.tool(
  "charge",
  "Одностадийный платёж (списание). Передайте криптограмму карты и сумму.",
  chargeSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleCharge(params) }],
  }),
);

server.tool(
  "auth",
  "Двухстадийный платёж (авторизация/холд). Деньги блокируются, но не списываются до подтверждения.",
  authSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleAuth(params) }],
  }),
);

server.tool(
  "confirm",
  "Подтвердить авторизованный платёж (списать заблокированную сумму). Можно подтвердить частичную сумму.",
  confirmSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleConfirm(params) }],
  }),
);

server.tool(
  "void_payment",
  "Отменить авторизованный платёж (разблокировать средства).",
  voidSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleVoid(params) }],
  }),
);

server.tool(
  "get_transaction",
  "Найти транзакцию по ID. Возвращает статус, сумму, карту, дату.",
  getTransactionSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleGetTransaction(params) }],
  }),
);

// Возвраты
server.tool(
  "refund",
  "Возврат платежа (полный или частичный) по ID транзакции.",
  refundSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleRefund(params) }],
  }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[cloudpayments-mcp] Сервер запущен. 6 инструментов. Первый MCP для CloudPayments.");
}

main().catch((error) => {
  console.error("[cloudpayments-mcp] Ошибка запуска:", error);
  process.exit(1);
});
