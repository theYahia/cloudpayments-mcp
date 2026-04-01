import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.CLOUDPAYMENTS_PUBLIC_ID = "test_pk_123";
process.env.CLOUDPAYMENTS_API_SECRET = "test_secret";

import {
  handleCreateSubscription,
  handleUpdateSubscription,
  handleCancelSubscription,
  handleListSubscriptions,
} from "../src/tools/subscriptions.js";
import { handleCreateOrder, handleListTransactions } from "../src/tools/orders.js";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

function mockOk(data: unknown) {
  return { ok: true, status: 200, json: async () => data, text: async () => JSON.stringify(data) };
}

beforeEach(() => { mockFetch.mockReset(); });

describe("subscriptions", () => {
  it("creates a subscription", async () => {
    const resp = { Success: true, Message: null, Model: { Id: "sub_1", Status: "Active", Amount: 999 } };
    mockFetch.mockResolvedValueOnce(mockOk(resp));

    const result = JSON.parse(await handleCreateSubscription({
      Token: "token_abc",
      AccountId: "user_123",
      Description: "Monthly plan",
      Amount: 999,
      Currency: "RUB",
      RequireConfirmation: false,
      StartDate: "2026-05-01T00:00:00",
      Interval: "Month",
      Period: 1,
    }));

    expect(result.Success).toBe(true);
    expect(result.Model.Id).toBe("sub_1");

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.Token).toBe("token_abc");
    expect(body.Interval).toBe("Month");
    expect(body.Period).toBe(1);
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("/subscriptions/create");
  });

  it("updates a subscription", async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ Success: true, Model: { Id: "sub_1", Amount: 1499 } }));

    const result = JSON.parse(await handleUpdateSubscription({
      Id: "sub_1",
      Amount: 1499,
    }));

    expect(result.Model.Amount).toBe(1499);
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("/subscriptions/update");
  });

  it("cancels a subscription", async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ Success: true, Message: null, Model: {} }));

    const result = JSON.parse(await handleCancelSubscription({ Id: "sub_1" }));
    expect(result.Success).toBe(true);

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("/subscriptions/cancel");
  });

  it("lists subscriptions for a user", async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ Success: true, Model: [{ Id: "sub_1" }, { Id: "sub_2" }] }));

    const result = JSON.parse(await handleListSubscriptions({ AccountId: "user_123" }));
    expect(result.Model).toHaveLength(2);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.AccountId).toBe("user_123");
  });
});

describe("orders", () => {
  it("creates an order with payment link", async () => {
    const resp = {
      Success: true,
      Model: { Id: "ord_1", Amount: 3000, Url: "https://orders.cloudpayments.ru/d/ord_1", Status: "Created" },
    };
    mockFetch.mockResolvedValueOnce(mockOk(resp));

    const result = JSON.parse(await handleCreateOrder({
      Amount: 3000,
      Currency: "RUB",
      Description: "Premium plan",
      Email: "buyer@example.com",
    }));

    expect(result.Model.Url).toBeDefined();
    expect(result.Model.Amount).toBe(3000);

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("/orders/create");
  });
});

describe("list_transactions", () => {
  it("lists transactions for a date", async () => {
    const resp = {
      Success: true,
      Model: [
        { TransactionId: 1, Amount: 100, Status: "Completed" },
        { TransactionId: 2, Amount: 200, Status: "Declined" },
      ],
    };
    mockFetch.mockResolvedValueOnce(mockOk(resp));

    const result = JSON.parse(await handleListTransactions({
      Date: "2026-03-15",
      TimeZone: "UTC",
    }));

    expect(result.Model).toHaveLength(2);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.Date).toBe("2026-03-15");
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("/payments/list");
  });
});
