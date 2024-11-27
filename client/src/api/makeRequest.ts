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
    throw new Error(error.message);
  }

  const text = await response.text();
  return text.trim() ? JSON.parse(text) : {};
};
