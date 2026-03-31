import { describe, it, expect, vi } from "vitest";

vi.mock("../src/client.js", () => ({
  CloudPaymentsClient: class {
    post = vi.fn();
  },
}));

import { chargeSchema, authSchema, confirmSchema, voidSchema, getTransactionSchema } from "../src/tools/payments.js";
import { refundSchema } from "../src/tools/refunds.js";

describe("chargeSchema", () => {
  it("accepts valid charge params", () => {
    const result = chargeSchema.safeParse({
      Amount: 100,
      IpAddress: "192.168.1.1",
      CardCryptogramPacket: "cryptogram-data",
    });
    expect(result.success).toBe(true);
  });

  it("requires Amount, IpAddress, CardCryptogramPacket", () => {
    expect(chargeSchema.safeParse({}).success).toBe(false);
    expect(chargeSchema.safeParse({ Amount: 100 }).success).toBe(false);
  });

  it("rejects negative amounts", () => {
    expect(chargeSchema.safeParse({
      Amount: -10,
      IpAddress: "1.1.1.1",
      CardCryptogramPacket: "x",
    }).success).toBe(false);
  });

  it("applies default currency", () => {
    const result = chargeSchema.parse({
      Amount: 100,
      IpAddress: "1.1.1.1",
      CardCryptogramPacket: "x",
    });
    expect(result.Currency).toBe("RUB");
  });
});

describe("authSchema", () => {
  it("accepts valid auth params", () => {
    const result = authSchema.safeParse({
      Amount: 500,
      IpAddress: "10.0.0.1",
      CardCryptogramPacket: "crypto",
    });
    expect(result.success).toBe(true);
  });
});

describe("confirmSchema", () => {
  it("requires TransactionId and Amount", () => {
    expect(confirmSchema.safeParse({}).success).toBe(false);
    expect(confirmSchema.safeParse({ TransactionId: 123 }).success).toBe(false);
    expect(confirmSchema.safeParse({ TransactionId: 123, Amount: 50 }).success).toBe(true);
  });
});

describe("voidSchema", () => {
  it("requires TransactionId", () => {
    expect(voidSchema.safeParse({}).success).toBe(false);
    expect(voidSchema.safeParse({ TransactionId: 123 }).success).toBe(true);
  });
});

describe("getTransactionSchema", () => {
  it("requires TransactionId", () => {
    expect(getTransactionSchema.safeParse({}).success).toBe(false);
    expect(getTransactionSchema.safeParse({ TransactionId: 456 }).success).toBe(true);
  });
});

describe("refundSchema", () => {
  it("requires TransactionId and Amount", () => {
    expect(refundSchema.safeParse({}).success).toBe(false);
    expect(refundSchema.safeParse({ TransactionId: 123, Amount: 50 }).success).toBe(true);
  });

  it("accepts optional JsonData", () => {
    const result = refundSchema.safeParse({
      TransactionId: 123,
      Amount: 50,
      JsonData: '{"reason":"test"}',
    });
    expect(result.success).toBe(true);
  });
});
