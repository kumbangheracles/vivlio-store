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

export type TransactionStatus = "pending" | "paid" | "canceled" | "" | string;
export const transactionStatusStyle: Record<TransactionStatus, string> = {
  pending: "text-yellow-700 bg-yellow-100",
  paid: "text-green-700 bg-green-100",
  canceled: "text-red-700 bg-red-200",
  "": "text-gray-500 bg-gray-100",
};

export type PaymentType =
  | "bank_transfer"
  | "credit_card"
  | "gopay"
  | "qris"
  | "shopeepay"
  | string;

export type FraudStatus = "accept" | "challenge" | "deny";
