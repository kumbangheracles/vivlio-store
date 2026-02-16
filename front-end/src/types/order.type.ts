export interface MidtransTransactionDetail {
  expirityTime: string;
  transaction_status: TransactionStatus;
  payment_type: PaymentType;
  va_numbers?: VaNumber[];
  fraud_status?: FraudStatus;
  gross_amount: string;
  transaction_time: string;
  expiry_time?: string;
}

export interface VaNumber {
  bank: string;
  va_number: string;
}

export type TransactionStatus =
  | "pending"
  | "settlement"
  | "capture"
  | "deny"
  | "cancel"
  | "expire"
  | "failure";

export type PaymentType =
  | "bank_transfer"
  | "credit_card"
  | "gopay"
  | "qris"
  | "shopeepay"
  | string;

export type FraudStatus = "accept" | "challenge" | "deny";
