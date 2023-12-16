import { writable, get } from "svelte/store";
import type { LoggedInUser } from "../types/logged-in-user";
import { replace } from "svelte-spa-router";
import type { LoginUser } from "../types/user-login";

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

const login = async (user: LoginUser) => {
  try {
    let response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      let err = await response.json();
      throw new Error(err.message);
    }

    let loggedInUser = await response.json();
    authStore.set(loggedInUser);
    replace("/");
  } catch (e: any) {
    throw new Error(e.message);
  }
};

const logout = async () => {
  try {
    let response = await fetch("http://localhost:3000/auth/logout", {
      method: "GET",
      headers: {
        authorization: `Bearer ${get(authStore)?.access_token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      let err = await response.json();
      throw new Error(err.message);
    }

    authStore.set(null);
    replace("/");
  } catch (e: any) {
    console.log(e.message);
  }
};

export { authStore, refreshToken, logout, login };
