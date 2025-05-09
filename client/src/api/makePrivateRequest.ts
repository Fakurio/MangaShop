import { get } from "svelte/store";
import { authStore, refreshToken } from "../stores/auth.store";
import { BadRequestError } from "./errors/BadRequestError";

export const makePrivateRequest = async (
  endpoint: string,
  method: string,
  credentials?: RequestCredentials,
  body?: any
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
    // console.log("Access token failed");
    const error = await response.json();
    if (response.status === 400) {
      throw new BadRequestError(error);
    }
    if (response.status !== 401 && response.status !== 403) {
      throw new Error(error.message);
    }
    try {
      await refreshToken();
    } catch (error: any) {
      throw error;
    }
    response = await makeRequest();
    const text = await response.text();
    return text.trim() ? JSON.parse(text) : {};
  }

  const text = await response.text();
  return text.trim() ? JSON.parse(text) : {};
};
