/** Стандартный ответ CloudPayments API */
export interface CloudPaymentsResponse<T = unknown> {
  Success: boolean;
  Message: string | null;
  Model: T;
}

/** Транзакция CloudPayments */
export interface Transaction {
  TransactionId: number;
  Amount: number;
  Currency: string;
  CurrencyCode: number;
  InvoiceId?: string;
  AccountId?: string;
  Email?: string;
  Description?: string;
  CardFirstSix: string;
  CardLastFour: string;
  CardExpDate: string;
  CardType: string;
  IssuerBankCountry: string;
  Status: "AwaitingAuthentication" | "Authorized" | "Completed" | "Cancelled" | "Declined";
  StatusCode: number;
  Reason: string;
  ReasonCode: number;
  Token?: string;
  TestMode: boolean;
  DateTime: string;
  TotalFee?: number;
  JsonData?: string;
}

/** Возврат CloudPayments */
export interface Refund {
  TransactionId: number;
  Amount: number;
  DateTime: string;
}

/** Ошибка CloudPayments */
export interface CloudPaymentsError {
  Success: false;
  Message: string;
}
