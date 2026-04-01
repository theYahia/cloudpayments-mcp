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
import {
  createSubscriptionSchema, handleCreateSubscription,
  updateSubscriptionSchema, handleUpdateSubscription,
  cancelSubscriptionSchema, handleCancelSubscription,
  listSubscriptionsSchema, handleListSubscriptions,
} from "./tools/subscriptions.js";
import {
  createOrderSchema, handleCreateOrder,
  listTransactionsSchema, handleListTransactions,
} from "./tools/orders.js";

const server = new McpServer({
  name: "cloudpayments-mcp",
  version: "2.0.0",
});

// === Payments (5) ===

server.tool(
  "charge_payment",
  "One-step payment (immediate charge). Pass card cryptogram from CloudPayments widget, amount, and payer IP.",
  chargeSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleCharge(params) }],
  }),
);

server.tool(
  "auth_payment",
  "Two-step payment (authorize/hold). Funds are blocked but not charged until confirmed.",
  authSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleAuth(params) }],
  }),
);

server.tool(
  "confirm_payment",
  "Confirm an authorized payment (charge the held amount). Can confirm a partial amount.",
  confirmSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleConfirm(params) }],
  }),
);

server.tool(
  "void_payment",
  "Void an authorized payment (release the hold). Works only before confirmation.",
  voidSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleVoid(params) }],
  }),
);

server.tool(
  "get_transaction",
  "Find a transaction by ID. Returns status, amount, card info, and timestamps.",
  getTransactionSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleGetTransaction(params) }],
  }),
);

// === Refunds (1) ===

server.tool(
  "refund_payment",
  "Refund a payment (full or partial) by transaction ID.",
  refundSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleRefund(params) }],
  }),
);

// === Subscriptions (4) ===

server.tool(
  "create_subscription",
  "Create a recurring subscription. Requires a token from a previous payment. Charges automatically on schedule.",
  createSubscriptionSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleCreateSubscription(params) }],
  }),
);

server.tool(
  "update_subscription",
  "Update subscription parameters: amount, interval, period, description.",
  updateSubscriptionSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleUpdateSubscription(params) }],
  }),
);

server.tool(
  "cancel_subscription",
  "Cancel an active subscription by ID. Stops all future charges.",
  cancelSubscriptionSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleCancelSubscription(params) }],
  }),
);

server.tool(
  "list_subscriptions",
  "List all subscriptions for a given user (AccountId).",
  listSubscriptionsSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleListSubscriptions(params) }],
  }),
);

// === Orders (1) ===

server.tool(
  "create_order",
  "Create a payment order (invoice link). Returns a URL the payer can open to pay.",
  createOrderSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleCreateOrder(params) }],
  }),
);

// === Transactions (1) ===

server.tool(
  "list_transactions",
  "List all transactions for a given date. Returns completed, authorized, and declined transactions.",
  listTransactionsSchema.shape,
  async (params) => ({
    content: [{ type: "text", text: await handleListTransactions(params) }],
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
    console.error("[cloudpayments-mcp] Server started (stdio). 12 tools. Production-grade CloudPayments MCP.");
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
      res.end(JSON.stringify({ status: "ok", tools: 12, transport: "streamable-http" }));
      return;
    }
    if (req.url === "/mcp") { await transport.handleRequest(req, res); return; }
    res.writeHead(404); res.end("Not found. Use /mcp or /health.");
  });
  await server.connect(transport);
  httpServer.listen(port, () => {
    console.error(`[cloudpayments-mcp] HTTP server on port ${port}. 12 tools available.`);
  });
}

const isDirectRun = process.argv[1]?.endsWith("index.js") || process.argv[1]?.endsWith("index.ts");
if (isDirectRun) {
  main().catch((error) => { console.error("[cloudpayments-mcp] Startup error:", error); process.exit(1); });
}

export { server };
