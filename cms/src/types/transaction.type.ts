import { BookProps } from "./books.type";

export type TransactionStatus = "pending" | "paid" | "canceled" | "" | string;
export const transactionStatusStyle: Record<TransactionStatus, string> = {
  pending: "text-yellow-700 bg-yellow-100",
  paid: "text-green-700 bg-green-100",
  canceled: "text-red-700 bg-red-200",
  "": "text-gray-500 bg-gray-100",
};

export interface TransactionProps {
  id: string;
  book: BookProps;
  bookId: string;
  orderId: string;
  orderGroupId: string;
  midtransToken: string;
  paymentStatus: TransactionStatus;
  userId: string;
  quantity: number;
  priceAtPurchases: number;
  purchaseDate: Date;
  order_number: string;
  expiry_time: string;
}

export interface TransactionParams {
  title?: string;
  page?: number;
  limitOrders?: string;
  orderStatus?: string;
  sortDateOrders?: string;
  sortOrder?: string;
}
