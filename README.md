# @theyahia/cloudpayments-mcp

MCP-сервер для CloudPayments API — одностадийные и двухстадийные платежи, подтверждение, отмена, возвраты, поиск транзакций. **6 инструментов.** Первый MCP-сервер для CloudPayments.

[![npm](https://img.shields.io/npm/v/@theyahia/cloudpayments-mcp)](https://www.npmjs.com/package/@theyahia/cloudpayments-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Часть серии [Russian API MCP](https://github.com/theYahia/russian-mcp) (50 серверов) by [@theYahia](https://github.com/theYahia).

## Установка

### Claude Desktop

```json
{
  "mcpServers": {
    "cloudpayments": {
      "command": "npx",
      "args": ["-y", "@theyahia/cloudpayments-mcp"],
      "env": {
        "CLOUDPAYMENTS_PUBLIC_ID": "ваш-public-id",
        "CLOUDPAYMENTS_API_SECRET": "ваш-api-secret"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add cloudpayments -e CLOUDPAYMENTS_PUBLIC_ID=ваш-id -e CLOUDPAYMENTS_API_SECRET=ваш-secret -- npx -y @theyahia/cloudpayments-mcp
```

### VS Code / Cursor

```json
{
  "servers": {
    "cloudpayments": {
      "command": "npx",
      "args": ["-y", "@theyahia/cloudpayments-mcp"],
      "env": {
        "CLOUDPAYMENTS_PUBLIC_ID": "ваш-public-id",
        "CLOUDPAYMENTS_API_SECRET": "ваш-api-secret"
      }
    }
  }
}
```

### Windsurf

```json
{
  "mcpServers": {
    "cloudpayments": {
      "command": "npx",
      "args": ["-y", "@theyahia/cloudpayments-mcp"],
      "env": {
        "CLOUDPAYMENTS_PUBLIC_ID": "ваш-public-id",
        "CLOUDPAYMENTS_API_SECRET": "ваш-api-secret"
      }
    }
  }
}
```

## Переменные окружения

| Переменная | Обязательна | Описание |
|------------|:-----------:|----------|
| `CLOUDPAYMENTS_PUBLIC_ID` | Да | Public ID сайта (Личный кабинет → Настройки сайта) |
| `CLOUDPAYMENTS_API_SECRET` | Да | API Secret (Личный кабинет → Настройки сайта → API) |

Для тестирования используйте [тестовый терминал CloudPayments](https://developers.cloudpayments.ru/#testirovanie).

## Инструменты (6)

### Платежи (5)

| Инструмент | Метод | Описание |
|------------|-------|----------|
| `charge` | POST /payments/charge | Одностадийный платёж (мгновенное списание) |
| `auth` | POST /payments/auth | Двухстадийный платёж (авторизация/холд) |
| `confirm` | POST /payments/confirm | Подтвердить авторизованный платёж (полная или частичная сумма) |
| `void_payment` | POST /payments/void | Отменить авторизованный платёж |
| `get_transaction` | POST /payments/find | Найти транзакцию по ID |

### Возвраты (1)

| Инструмент | Метод | Описание |
|------------|-------|----------|
| `refund` | POST /payments/refund | Полный или частичный возврат по ID транзакции |

## Примеры запросов

```
Создай одностадийный платёж на 5000 рублей
```

```
Авторизуй (холд) 10000 рублей на карте
```

```
Подтверди транзакцию 123456 на сумму 8000 рублей
```

```
Отмени авторизованную транзакцию 123456
```

```
Сделай возврат 2500 рублей по транзакции 123456
```

```
Найди транзакцию 123456
```

## Часть серии Russian API MCP

| MCP | Статус | Описание |
|-----|--------|----------|
| [@metarebalance/dadata-mcp](https://github.com/theYahia/dadata-mcp) | готов | Адреса, компании, банки, телефоны |
| [@theyahia/cbr-mcp](https://github.com/theYahia/cbr-mcp) | готов | Курсы валют, ключевая ставка |
| [@theyahia/yookassa-mcp](https://github.com/theYahia/yookassa-mcp) | готов | Платежи, возвраты, чеки 54-ФЗ |
| [@theyahia/cloudpayments-mcp](https://github.com/theYahia/cloudpayments-mcp) | готов | Платежи, возвраты, эквайринг |
| ... | | **+46 серверов** — [полный список](https://github.com/theYahia/russian-mcp) |

## Лицензия

MIT
