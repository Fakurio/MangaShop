import { get } from "svelte/store";
import { authStore, refreshToken } from "../stores/auth.store";

export const makePrivateRequest = async (
  endpoint: string,
  method: string,
  credentials?: RequestCredentials,
  body?: any,
) => {
  const makeRequest = async () => {
    return await fetch(`${import.meta.env.VITE_SERVER_HOST}${endpoint}`, {
      method: method,
      headers: {
        authorization: `Bearer ${get(authStore)?.access_token}`,
        "content-type": "application/json",
      },
      credentials: credentials ? credentials : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  let response = await makeRequest();

  if (!response.ok) {
    await refreshToken();
    response = await makeRequest();
    const text = await response.text();
    return text.trim() ? JSON.parse(text) : {};
  }

  const text = await response.text();
  return text.trim() ? JSON.parse(text) : {};
};