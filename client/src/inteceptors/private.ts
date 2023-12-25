import { get } from "svelte/store";
import { authStore, refreshToken } from "../stores/auth.store";

const usePrivateInterceptor = async (
  url: string,
  method: string,
  body?: any,
  credentials?: RequestCredentials
) => {
  const makeRequest = async () => {
    return await fetch(`http://localhost:3000/${url}`, {
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
    return response;
  }

  return response;
};

export { usePrivateInterceptor };
