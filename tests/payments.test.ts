import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.CLOUDPAYMENTS_PUBLIC_ID = "test_pk_123";
process.env.CLOUDPAYMENTS_API_SECRET = "test_secret";

import {
  handleCharge,
  handleAuth,
  handleConfirm,
  handleVoid,
  handleGetTransaction,
} from "../src/tools/payments.js";
import { handleRefund } from "../src/tools/refunds.js";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

function mockOk(data: unknown) {
  return { ok: true, status: 200, json: async () => data, text: async () => JSON.stringify(data) };
}

function mockError(status: number, body: string) {
  return { ok: false, status, text: async () => body };
}

beforeEach(() => { mockFetch.mockReset(); });

describe("charge_payment", () => {
  it("creates a one-step payment", async () => {
    const resp = { Success: true, Message: null, Model: { TransactionId: 12345, Amount: 1000, Status: "Completed" } };
    mockFetch.mockResolvedValueOnce(mockOk(resp));

    const result = JSON.parse(await handleCharge({
      Amount: 1000,
      Currency: "RUB",
      IpAddress: "127.0.0.1",
      CardCryptogramPacket: "crypto_packet_data",
      Description: "Test charge",
    }));

    expect(result.Success).toBe(true);
    expect(result.Model.TransactionId).toBe(12345);

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toBe("https://api.cloudpayments.ru/payments/charge");
    expect(opts.method).toBe("POST");
    const body = JSON.parse(opts.body);
    expect(body.Amount).toBe(1000);
    expect(body.IpAddress).toBe("127.0.0.1");
  });
});

describe("auth_payment", () => {
  it("creates a two-step payment (hold)", async () => {
    const resp = { Success: true, Message: null, Model: { TransactionId: 12346, Status: "Authorized" } };
    mockFetch.mockResolvedValueOnce(mockOk(resp));

    const result = JSON.parse(await handleAuth({
      Amount: 5000,
      Currency: "RUB",
      IpAddress: "10.0.0.1",
      CardCryptogramPacket: "crypto_data",
    }));

    expect(result.Model.Status).toBe("Authorized");
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("/payments/auth");
  });
});

describe("confirm_payment", () => {
  it("confirms an authorized payment", async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ Success: true, Message: null, Model: {} }));

    const result = JSON.parse(await handleConfirm({ TransactionId: 12346, Amount: 5000 }));
    expect(result.Success).toBe(true);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.TransactionId).toBe(12346);
    expect(body.Amount).toBe(5000);
  });

  it("confirms a partial amount", async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ Success: true, Message: null, Model: {} }));

    await handleConfirm({ TransactionId: 12346, Amount: 3000 });
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.Amount).toBe(3000);
  });
});

describe("void_payment", () => {
  it("voids an authorized transaction", async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ Success: true, Message: null, Model: {} }));

    const result = JSON.parse(await handleVoid({ TransactionId: 12346 }));
    expect(result.Success).toBe(true);

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("/payments/void");
  });
});

describe("refund_payment", () => {
  it("refunds a transaction", async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ Success: true, Message: null, Model: { TransactionId: 99 } }));

    const result = JSON.parse(await handleRefund({ TransactionId: 12345, Amount: 500 }));
    expect(result.Success).toBe(true);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.TransactionId).toBe(12345);
    expect(body.Amount).toBe(500);
  });
});

describe("get_transaction", () => {
  it("finds a transaction by ID", async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ Success: true, Model: { TransactionId: 12345, Status: "Completed" } }));

    const result = JSON.parse(await handleGetTransaction({ TransactionId: 12345 }));
    expect(result.Model.TransactionId).toBe(12345);

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("/payments/find");
  });
});

describe("error handling", () => {
  it("retries on 429 and eventually throws", async () => {
    mockFetch.mockResolvedValue(mockError(429, "Rate limited"));

    await expect(handleGetTransaction({ TransactionId: 1 })).rejects.toThrow("429");
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("throws on 401 with credential hint", async () => {
    mockFetch.mockResolvedValueOnce(mockError(401, "Unauthorized"));

    await expect(handleCharge({
      Amount: 100,
      Currency: "RUB",
      IpAddress: "1.2.3.4",
      CardCryptogramPacket: "abc",
    })).rejects.toThrow("CLOUDPAYMENTS");
  });
});
