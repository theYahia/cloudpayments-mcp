import type { CloudPaymentsResponse } from "./types.js";

const BASE_URL = "https://api.cloudpayments.ru";
const TIMEOUT = 10_000;
const MAX_RETRIES = 3;

export class CloudPaymentsClient {
  private authHeader: string;

  constructor() {
    const publicId = process.env.CLOUDPAYMENTS_PUBLIC_ID ?? "";
    const apiSecret = process.env.CLOUDPAYMENTS_API_SECRET ?? "";

    if (!publicId || !apiSecret) {
      throw new Error(
        "Переменные окружения CLOUDPAYMENTS_PUBLIC_ID и CLOUDPAYMENTS_API_SECRET обязательны. " +
        "Получите их в личном кабинете CloudPayments: Настройки сайта → API."
      );
    }

    this.authHeader = "Basic " + Buffer.from(`${publicId}:${apiSecret}`).toString("base64");
  }

  async post<T = unknown>(path: string, body?: Record<string, unknown>): Promise<CloudPaymentsResponse<T>> {
    return this.request(path, body);
  }

  private async request<T>(path: string, body?: Record<string, unknown>): Promise<CloudPaymentsResponse<T>> {
    const url = `${BASE_URL}${path}`;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": this.authHeader,
            "Content-Type": "application/json",
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });
        clearTimeout(timer);

        if (response.ok) {
          return response.json() as Promise<CloudPaymentsResponse<T>>;
        }

        // Retry на 429 и 5xx
        if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
          const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
          console.error(`[cloudpayments-mcp] ${response.status} от ${path}, повтор через ${delay}мс (${attempt}/${MAX_RETRIES})`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }

        const errorBody = await response.text();
        const hint = response.status === 401
          ? " Проверьте CLOUDPAYMENTS_PUBLIC_ID и CLOUDPAYMENTS_API_SECRET."
          : "";
        throw new Error(`CloudPayments HTTP ${response.status}: ${errorBody}${hint}`);
      } catch (error) {
        clearTimeout(timer);
        if (error instanceof DOMException && error.name === "AbortError") {
          if (attempt < MAX_RETRIES) {
            console.error(`[cloudpayments-mcp] Таймаут ${path}, повтор (${attempt}/${MAX_RETRIES})`);
            continue;
          }
          throw new Error("CloudPayments: таймаут запроса (10 секунд). Попробуйте позже.");
        }
        throw error;
      }
    }

    throw new Error("CloudPayments: все попытки исчерпаны");
  }
}
