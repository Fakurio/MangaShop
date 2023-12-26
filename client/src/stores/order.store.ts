import { writable, derived } from "svelte/store";
import type { Order } from "../types/order";
import { usePrivateInterceptor } from "../inteceptors/private";

enum SortFilter {
  DATE_ASC,
  DATE_DESC,
  PRICE_ASC,
  PRICE_DESC,
}

const orderStore = writable<Order[]>([]);
const sortFilter = writable(SortFilter.DATE_ASC);
const statusFilter = writable("Pending");
const filteredOrderStore = derived(
  [orderStore, sortFilter, statusFilter],
  ([$orderStore, $sortFilter, $statusFilter]) => {
    let filtered = $orderStore.filter((order: Order) => {
      return order.order_status === $statusFilter;
    });
    switch ($sortFilter) {
      case SortFilter.DATE_ASC:
        return filtered.sort(
          (a, b) => a.order_date.getTime() - b.order_date.getTime()
        );
      case SortFilter.DATE_DESC:
        return filtered.sort(
          (a, b) => a.order_date.getTime() + b.order_date.getTime()
        );
      case SortFilter.PRICE_ASC:
        return filtered.sort((a, b) =>
          a.total_price > b.total_price ? 1 : -1
        );
      case SortFilter.PRICE_DESC:
        return filtered.sort((a, b) =>
          a.total_price < b.total_price ? 1 : -1
        );
    }
  }
);

const fetchUserOrders = async () => {
  let response = await usePrivateInterceptor("order/all", "GET");
  let orders = await response.json();
  orders.map((order: any) => {
    order.order_date = new Date(order.order_date);
    order.total_price = Number.parseFloat(order.total_price);
  });
  orderStore.set(orders);
};

export {
  SortFilter,
  orderStore,
  sortFilter,
  statusFilter,
  filteredOrderStore,
  fetchUserOrders,
};
