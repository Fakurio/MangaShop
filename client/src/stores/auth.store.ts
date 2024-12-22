import { writable, get } from "svelte/store";
import type { LoggedInUser } from "../types/logged-in-user";
import { push, replace } from "svelte-spa-router";
import type { LoginForm } from "../types/user-login";
import type { CartItem } from "../types/cart-item";
import cartStore from "./cart.store";
import { catchError } from "../api/catchError";
import { makeRequest } from "../api/makeRequest";
import { makePrivateRequest } from "../api/makePrivateRequest";
import { ForbiddenError } from "../api/errors/ForbiddenError";
import { UnauthorizedError } from "../api/errors/UnauthorizedError";
import type { RegisterForm } from "../types/user-register";
import { RoleEnum } from "../enums/role-enum";

const authStore = writable<LoggedInUser | null>(null);

const refreshToken = async () => {
  const [error, data] = await catchError<LoggedInUser>(
    makeRequest("/auth/refresh", "GET", "include")
  );

  if (error instanceof ForbiddenError || error instanceof UnauthorizedError) {
    // console.log("Refresh token failed -> need to login again");
    throw error;
  }

  if (!error) {
    authStore.update(() => {
      return {
        username: data!.username,
        access_token: data!.access_token,
        roles: data!.roles,
      };
    });
  }
};

const login = async (user: LoginForm, cart: CartItem[]) => {
  const [error, data] = await catchError<
    LoggedInUser & { new_cart: CartItem[] }
  >(
    makeRequest("/auth/login", "POST", "include", { ...user, cart: [...cart] })
  );

  if (error) {
    throw error;
  }

  authStore.set({
    username: data.username,
    access_token: data.access_token,
    roles: data.roles,
  });
  localStorage.setItem("cart", JSON.stringify(data.new_cart));

  if (data.roles.includes(RoleEnum.ADMIN)) {
    // TODO: Block back button after login to return to admin dashboard
    await push("/admin");
  } else {
    await replace("/");
  }
};

const logout = async () => {
  const [error, _] = await catchError(
    makePrivateRequest("/auth/logout", "POST", "include", [...get(cartStore)])
  );

  authStore.set(null);
  cartStore.set([]);
  localStorage.removeItem("cart");
  await replace("/");
};

const register = async (registerForm: RegisterForm) => {
  const [error, data] = await catchError<{ message: string }>(
    makeRequest("/auth/register", "POST", "omit", registerForm)
  );
  if (error) {
    throw error;
  }
  return data;
};

export { authStore, refreshToken, logout, login, register };
