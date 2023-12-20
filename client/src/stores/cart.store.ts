import { writable, get } from "svelte/store";
import type { CartItem } from "../types/cart-item";
import { mangaStore } from "./manga.store";

const cartStore = writable<CartItem[]>([]);

const checkCart = () => {
  get(cartStore).forEach((item) => {
    let manga = get(mangaStore).find((m) => m.manga_id === item.manga_id);
    if (manga && item.quantity > manga.stock_quantity) {
      item.quantity = manga.stock_quantity;
    }
  });
};

const getCartFromLocalStorage = () => {
  const cart = localStorage.getItem("cart");
  if (cart) {
    cartStore.set(JSON.parse(cart));
  }
  checkCart();
  return true;
};

const updateCart = (item: CartItem) => {
  cartStore.update((items) => {
    return items.map((i) => {
      if (i.manga_id === item.manga_id) {
        return { ...i, quantity: item.quantity + i.quantity };
      } else {
        return i;
      }
    });
  });
};

const deleteFromCart = (manga_id: number) => {
  cartStore.update((items) => {
    return items.filter((i) => i.manga_id !== manga_id);
  });
  checkCart();
  localStorage.setItem("cart", JSON.stringify(get(cartStore)));
};

const addToCart = (item: CartItem) => {
  const existingItem = get(cartStore).find((i) => i.manga_id === item.manga_id);
  if (existingItem) {
    updateCart(item);
  } else {
    cartStore.update((items) => [...items, item]);
  }
  checkCart();
  localStorage.setItem("cart", JSON.stringify(get(cartStore)));
};

export default cartStore;
export { addToCart, deleteFromCart, getCartFromLocalStorage };
