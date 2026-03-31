# @theyahia/cloudpayments-mcp

MCP server for **CloudPayments** API. 6 tools for charge, auth, confirm, void, refund, and transaction lookup.

[![npm](https://img.shields.io/npm/v/@theyahia/cloudpayments-mcp)](https://www.npmjs.com/package/@theyahia/cloudpayments-mcp)
[![license](https://img.shields.io/npm/l/@theyahia/cloudpayments-mcp)](./LICENSE)

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
claude mcp add cloudpayments -e CLOUDPAYMENTS_PUBLIC_ID=id -e CLOUDPAYMENTS_API_SECRET=secret -- npx -y @theyahia/cloudpayments-mcp
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

## Tools

| Tool | Description |
|------|-------------|
| `charge` | One-stage payment (direct charge) |
| `auth` | Two-stage payment (authorization/hold) |
| `confirm` | Confirm authorized payment (partial OK) |
| `void_payment` | Cancel authorized payment |
| `get_transaction` | Find transaction by ID |
| `refund` | Full or partial refund |

## Auth

| Variable | Required | Description |
|----------|----------|-------------|
| `CLOUDPAYMENTS_PUBLIC_ID` | Yes | Public ID (HTTP Basic username) |
| `CLOUDPAYMENTS_API_SECRET` | Yes | API secret (HTTP Basic password) |

## HTTP Transport

```bash
HTTP_PORT=3000 npx @theyahia/cloudpayments-mcp
# or
npx @theyahia/cloudpayments-mcp --http 3000
```

Endpoints: `POST /mcp` (JSON-RPC), `GET /health` (status).

## Skills

- **skill-charge** -- process a one-stage payment via CloudPayments
- **skill-payment-status** -- find and check transaction status

## License

MIT
