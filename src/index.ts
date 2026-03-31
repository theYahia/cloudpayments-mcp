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
  version: "1.1.0",
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
  const httpPort = process.env.HTTP_PORT || (process.argv.includes("--http") ? process.argv[process.argv.indexOf("--http") + 1] : null);
  if (httpPort) {
    const port = parseInt(String(httpPort), 10) || 3000;
    await startHttpTransport(port);
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[cloudpayments-mcp] Сервер запущен (stdio). 6 инструментов.");
  }
}

async function startHttpTransport(port: number) {
  const { createServer } = await import("node:http");
  const { StreamableHTTPServerTransport } = await import("@modelcontextprotocol/sdk/server/streamableHttp.js");
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined as unknown as (() => string) });
  const httpServer = createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", tools: 6, transport: "streamable-http" }));
      return;
    }
    if (req.url === "/mcp") { await transport.handleRequest(req, res); return; }
    res.writeHead(404); res.end("Not found. Use /mcp or /health.");
  });
  await server.connect(transport);
  httpServer.listen(port, () => {
    console.error(`[cloudpayments-mcp] HTTP server on port ${port}. 6 tools available.`);
  });
}

const isDirectRun = process.argv[1]?.endsWith("index.js") || process.argv[1]?.endsWith("index.ts");
if (isDirectRun) {
  main().catch((error) => { console.error("[cloudpayments-mcp] Ошибка запуска:", error); process.exit(1); });
}

export { server };
