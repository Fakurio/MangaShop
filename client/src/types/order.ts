import type { OrderItem } from "./order-item";

export type Order = {
  order_id: number;
  total_price: number;
  order_status: string;
  order_date: Date;
  orderItems: OrderItem[];
};
