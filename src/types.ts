/** Standard CloudPayments API response */
export interface CloudPaymentsResponse<T = unknown> {
  Success: boolean;
  Message: string | null;
  Model: T;
}

/** CloudPayments transaction */
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

/** CloudPayments refund */
export interface Refund {
  TransactionId: number;
  Amount: number;
  DateTime: string;
}

/** CloudPayments subscription */
export interface Subscription {
  Id: string;
  AccountId: string;
  Description: string;
  Email?: string;
  Amount: number;
  Currency: string;
  CurrencyCode: number;
  RequireConfirmation: boolean;
  StartDate: string;
  StartDateIso: string;
  IntervalCode: number;
  Interval: string;
  Period: number;
  MaxPeriods?: number;
  StatusCode: number;
  Status: string;
  SuccessfulTransactionsNumber: number;
  FailedTransactionsNumber: number;
  LastTransactionDate?: string;
  NextTransactionDate?: string;
}

/** CloudPayments order (invoice link) */
export interface Order {
  Id: string;
  Number: number;
  Amount: number;
  Currency: string;
  CurrencyCode: number;
  Email?: string;
  Description?: string;
  Url: string;
  StatusCode: number;
  Status: string;
}

/** CloudPayments error */
export interface CloudPaymentsError {
  Success: false;
  Message: string;
}
