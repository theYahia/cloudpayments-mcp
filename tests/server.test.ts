import { describe, it, expect, vi } from "vitest";

vi.mock("@modelcontextprotocol/sdk/server/stdio.js", () => ({
  StdioServerTransport: vi.fn(),
}));

vi.mock("../src/client.js", () => ({
  CloudPaymentsClient: class {
    post = vi.fn();
  },
  getClient: () => ({ post: vi.fn() }),
}));

vi.spyOn(process, "exit").mockImplementation((() => {}) as any);

describe("server smoke test", () => {
  it("registers exactly 12 tools", async () => {
    const { server } = await import("../src/index.js");
    const s = server as any;
    expect(s._registeredTools).toBeDefined();
    const toolNames = Object.keys(s._registeredTools);
    expect(toolNames.length).toBe(12);
    const expected = [
      "charge_payment", "auth_payment", "confirm_payment", "void_payment",
      "get_transaction", "refund_payment",
      "create_subscription", "update_subscription", "cancel_subscription", "list_subscriptions",
      "create_order", "list_transactions",
    ];
    for (const n of expected) {
      expect(toolNames).toContain(n);
    }
  });
});
