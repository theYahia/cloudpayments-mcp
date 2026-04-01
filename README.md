# @theyahia/cloudpayments-mcp

MCP server for CloudPayments API -- one-step and two-step payments, refunds, subscriptions, orders (invoice links), transaction history. **12 tools.**

[![npm](https://img.shields.io/npm/v/@theyahia/cloudpayments-mcp)](https://www.npmjs.com/package/@theyahia/cloudpayments-mcp)
[![license](https://img.shields.io/npm/l/@theyahia/cloudpayments-mcp)](./LICENSE)

Part of [Russian API MCP](https://github.com/theYahia/russian-mcp) series by [@theYahia](https://github.com/theYahia).

## Quick Start

### Claude Desktop

```json
{
  "mcpServers": {
    "cloudpayments": {
      "command": "npx",
      "args": ["-y", "@theyahia/cloudpayments-mcp"],
      "env": {
        "CLOUDPAYMENTS_PUBLIC_ID": "your-public-id",
        "CLOUDPAYMENTS_API_SECRET": "your-api-secret"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add cloudpayments -e CLOUDPAYMENTS_PUBLIC_ID=your-id -e CLOUDPAYMENTS_API_SECRET=your-secret -- npx -y @theyahia/cloudpayments-mcp
```

### Cursor / Windsurf

```json
{
  "cloudpayments": {
    "command": "npx",
    "args": ["-y", "@theyahia/cloudpayments-mcp"],
    "env": {
      "CLOUDPAYMENTS_PUBLIC_ID": "your-public-id",
      "CLOUDPAYMENTS_API_SECRET": "your-api-secret"
    }
  }
}
```

### HTTP Transport

```bash
HTTP_PORT=3000 npx @theyahia/cloudpayments-mcp
# or
npx @theyahia/cloudpayments-mcp --http 3000
```

Endpoints: `POST /mcp` (JSON-RPC), `GET /health` (status).

## Auth

| Variable | Required | Description |
|----------|----------|-------------|
| `CLOUDPAYMENTS_PUBLIC_ID` | Yes | Public ID (HTTP Basic username) |
| `CLOUDPAYMENTS_API_SECRET` | Yes | API secret (HTTP Basic password) |

For testing, use the [CloudPayments test terminal](https://developers.cloudpayments.ru/#testirovanie).

## Tools (12)

### Payments (5)

| Tool | API Endpoint | Description |
|------|-------------|-------------|
| `charge_payment` | POST /payments/charge | One-step payment (immediate charge) |
| `auth_payment` | POST /payments/auth | Two-step payment (authorize/hold) |
| `confirm_payment` | POST /payments/confirm | Confirm authorized payment (full or partial) |
| `void_payment` | POST /payments/void | Void authorized payment (release hold) |
| `get_transaction` | POST /payments/find | Find transaction by ID |

### Refunds (1)

| Tool | API Endpoint | Description |
|------|-------------|-------------|
| `refund_payment` | POST /payments/refund | Full or partial refund by transaction ID |

### Subscriptions (4)

| Tool | API Endpoint | Description |
|------|-------------|-------------|
| `create_subscription` | POST /subscriptions/create | Create recurring subscription with token |
| `update_subscription` | POST /subscriptions/update | Update amount, interval, period |
| `cancel_subscription` | POST /subscriptions/cancel | Cancel active subscription |
| `list_subscriptions` | POST /subscriptions/find | List subscriptions for a user |

### Orders (1)

| Tool | API Endpoint | Description |
|------|-------------|-------------|
| `create_order` | POST /orders/create | Create payment order (invoice link) |

### Transactions (1)

| Tool | API Endpoint | Description |
|------|-------------|-------------|
| `list_transactions` | POST /payments/list | List all transactions for a date |

## Demo Prompts

```
Charge 5000 RUB from the card cryptogram, IP 192.168.1.1, description "Premium plan"
```

```
Create a monthly subscription for 999 RUB using token from the last payment, starting May 1st
```

```
Show me all transactions for yesterday and refund 2500 RUB on transaction 123456
```

## Part of Russian API MCP Series

| MCP | Status | Description |
|-----|--------|-------------|
| [@metarebalance/dadata-mcp](https://github.com/theYahia/dadata-mcp) | ready | Addresses, companies, banks, phones |
| [@theyahia/cbr-mcp](https://github.com/theYahia/cbr-mcp) | ready | Currency rates, key rate |
| [@theyahia/yookassa-mcp](https://github.com/theYahia/yookassa-mcp) | ready | Payments, refunds, receipts, payouts, webhooks |
| [@theyahia/cloudpayments-mcp](https://github.com/theYahia/cloudpayments-mcp) | ready | Payments, subscriptions, orders |
| ... | | **+46 servers** -- [full list](https://github.com/theYahia/russian-mcp) |

## License

MIT
