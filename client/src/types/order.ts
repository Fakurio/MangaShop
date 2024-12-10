import type { OrderItem } from "./order-item";

export type Order = {
  order_id: number;
  total_price: number | string;
  order_status: string;
  order_date: Date;
  orderItems: OrderItem[];
};
