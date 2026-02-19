import { BookProps } from "./books.type";
import { TransactionStatus } from "./order.type";

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
}
