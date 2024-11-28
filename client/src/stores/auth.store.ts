import { writable, get } from "svelte/store";
import type { LoggedInUser } from "../types/logged-in-user";
import { replace } from "svelte-spa-router";
import type { LoginUser } from "../types/user-login";
import type { CartItem } from "../types/cart-item";
import cartStore from "./cart.store";
import { catchError } from "../api/catchError";
import { makeRequest } from "../api/makeRequest";
import { makePrivateRequest } from "../api/makePrivateRequest";
import { ForbiddenError } from "../api/errors/ForbiddenError";

const authStore = writable<LoggedInUser | null>(null);

const refreshToken = async () => {
  const [error, data] = await catchError<LoggedInUser>(
    makeRequest("/auth/refresh", "GET", "include"),
  );

  if (error instanceof ForbiddenError) {
    console.log("Refresh token failed -> need to login again");
    throw error;
  }

  if (!error) {
    authStore.update(() => {
      return {
        username: data!.username,
        access_token: data!.access_token,
      };
    });
  }
};

const login = async (user: LoginUser, cart: CartItem[]) => {
  const [error, data] = await catchError<
    LoggedInUser & { new_cart: CartItem[] }
  >(
    makeRequest("/auth/login", "POST", "include", { ...user, cart: [...cart] }),
  );

  if (error) {
    throw error;
  }

  authStore.set({ username: data.username, access_token: data.access_token });
  localStorage.setItem("cart", JSON.stringify(data.new_cart));
  await replace("/");
};

const logout = async () => {
  const [error, _] = await catchError(
    makePrivateRequest("/auth/logout", "POST", "include", [...get(cartStore)]),
  );

  authStore.set(null);
  cartStore.set([]);
  localStorage.removeItem("cart");
  await replace("/");
};

export { authStore, refreshToken, logout, login };
