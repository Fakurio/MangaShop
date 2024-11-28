import { ForbiddenError } from "./errors/ForbiddenError";
import { UnauthorizedError } from "./errors/UnauthorizedError";

export const makeRequest = async (
  endpoint: string,
  method: string,
  credentials?: RequestCredentials,
  body?: any,
) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_HOST}${endpoint}`,
    {
      method: method,
      headers: {
        "content-type": "application/json",
      },
      credentials: credentials ? credentials : undefined,
      body: body ? JSON.stringify(body) : undefined,
    },
  );

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 403) {
      throw new ForbiddenError(error.message);
    }
    if (response.status === 401) {
      throw new UnauthorizedError(error.message);
    }
    throw new Error(error.message);
  }

  const text = await response.text();
  return text.trim() ? JSON.parse(text) : {};
};
