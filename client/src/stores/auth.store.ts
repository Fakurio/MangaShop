import { writable, get } from "svelte/store";
import type { LoggedInUser } from "../types/logged-in-user";
import { replace } from "svelte-spa-router";
import type { LoginUser } from "../types/user-login";
import type { CartItem } from "../types/cart-item";
import cartStore from "./cart.store";
import { usePrivateInterceptor } from "../inteceptors/private";

const authStore = writable<LoggedInUser | null>(null);

const refreshToken = async () => {
  try {
    let response = await fetch("http://localhost:3000/auth/refresh", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      let err = await response.json();
      throw new Error(err.message);
    }

    let data = await response.json();
    authStore.update((prev: LoggedInUser | null) => {
      return {
        ...prev!,
        username: data.username,
        access_token: data.access_token,
      };
    });
  } catch (e: any) {}
};

const login = async (user: LoginUser, cart: CartItem[]) => {
  try {
    let response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ...user, cart: [...cart] }),
    });

    if (!response.ok) {
      let err = await response.json();
      throw new Error(err.message);
    }

    const { username, access_token, new_cart } = await response.json();
    authStore.set({ username, access_token });
    localStorage.setItem("cart", JSON.stringify(new_cart));
    replace("/");
  } catch (e: any) {
    throw new Error(e.message);
  }
};

const logout = async () => {
  try {
    let payload = [...get(cartStore)];

    let response = await usePrivateInterceptor(
      "auth/logout",
      "POST",
      payload,
      "include"
    );

    if (!response.ok) {
      let err = await response.json();
      throw new Error(err.message);
    }

    authStore.set(null);
    cartStore.set([]);
    localStorage.removeItem("cart");
    replace("/");
  } catch (e: any) {
    console.log(e.message);
  }
};

export { authStore, refreshToken, logout, login };
