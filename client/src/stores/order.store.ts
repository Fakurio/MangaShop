import { derived, get, writable } from "svelte/store";
import type { Order } from "../types/order";
import { catchError } from "../api/catchError";
import { makePrivateRequest } from "../api/makePrivateRequest";
import { replace } from "svelte-spa-router";
import { authStore } from "./auth.store";
import cartStore from "./cart.store";
import { makeRequest } from "../api/makeRequest";
import type { PaymentMethod } from "../types/payment-method";
import { UnauthorizedError } from "../api/errors/UnauthorizedError";

enum SortFilter {
  DATE_ASC = "By date ascending",
  DATE_DESC = "By date descending",
  PRICE_ASC = "By price ascending",
  PRICE_DESC = "By price descending",
}

const orderStore = writable<Order[]>([]);
const sortFilter = writable(SortFilter.DATE_DESC);
const statusFilter = writable("Pending");
const filteredOrderStore = derived(
  [orderStore, sortFilter, statusFilter],
  ([$orderStore, $sortFilter, $statusFilter]) => {
    let filtered = $orderStore.filter((order: Order) => {
      return order.order_status === $statusFilter;
    });
    switch ($sortFilter) {
      case SortFilter.DATE_ASC:
        // @ts-ignore
        return filtered.sort((a, b) => a.order_date - b.order_date);
      case SortFilter.DATE_DESC:
        // @ts-ignore
        return filtered.sort((a, b) => a.order_date + b.order_date);
      case SortFilter.PRICE_ASC:
        return filtered.sort((a, b) =>
          a.total_price > b.total_price ? 1 : -1,
        );
      case SortFilter.PRICE_DESC:
        return filtered.sort((a, b) =>
          a.total_price < b.total_price ? 1 : -1,
        );
    }
  },
);

const fetchOrderStatuses = async () => {
  return await makeRequest("/order/status", "GET");
};

const fetchUserOrders = async () => {
  const [error, data] = await catchError<Order[]>(
    makePrivateRequest("/order", "GET", "include"),
  );

  if (!error) {
    data.map((order) => {
      order.order_date = new Date(order.order_date);
      order.total_price = Number.parseFloat(order.total_price as string);
    });
    orderStore.set(data);
  } else {
    authStore.set(null);
    cartStore.set([]);
    await replace("/login");
  }
};

const fetchPaymentMethods = async () => {
  const [error, data] = await catchError<PaymentMethod[]>(
    makeRequest("/payment", "GET"),
  );

  if (error) {
    throw error;
  } else {
    return data;
  }
};

const createOrder = async (
  paymentMethod: string,
  totalValue: string,
): Promise<[boolean | undefined, string]> => {
  const payload = {
    cart: get(cartStore),
    payment_method: paymentMethod,
    total: Number.parseFloat(totalValue),
  };
  const [error, data] = await catchError(
    makePrivateRequest("/order", "POST", undefined, payload),
  );

  if (error) {
    if (error instanceof UnauthorizedError) {
      authStore.set(null);
      await replace("/login");
    }
    return [true, error.message];
  } else {
    localStorage.removeItem("cart");
    cartStore.set([]);
    return [false, data];
  }
};

export {
  SortFilter,
  orderStore,
  sortFilter,
  statusFilter,
  filteredOrderStore,
  fetchUserOrders,
  fetchOrderStatuses,
  fetchPaymentMethods,
  createOrder,
};
