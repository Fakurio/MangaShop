import { writable, get } from "svelte/store";
import type { LoggedInUser } from "../types/logged-in-user";

const authStore = writable<LoggedInUser>();

const refreshToken = async () => {
  let response = await fetch("http://localhost:3000/auth/refresh", {
    method: "POST",
    headers: {
      authorization: `Bearer ${get(authStore).refresh_token}`,
    },
  });
  let data = await response.json();
  authStore.update((prev: LoggedInUser) => {
    return { ...prev, access_token: data.access_token };
  });

  return data.access_token;
};

export { authStore, refreshToken };
