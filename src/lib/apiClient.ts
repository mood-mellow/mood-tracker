// lib/apiClient.ts

import { fetchAuthSession } from "aws-amplify/auth";

/**
 * Performs a fetch request with the Authorization header automatically attached.
 *
 * This utility retrieves the current AWS Cognito access token using `fetchAuthSession()`
 * from AWS Amplify and appends it to the `Authorization` header as a Bearer token.
 *
 * @template T - The expected response type after JSON parsing.
 *
 * @param {string} url - The absolute or relative URL of the API endpoint.
 * @param {RequestInit} [options] - Optional fetch configuration, such as method, headers, and body.
 *
 * @returns {Promise<T>} - A promise that resolves to the parsed JSON response.
 *
 * @throws {Error} - Throws an error if the response is not OK (status >= 400),
 * including the HTTP status code and response text.
 *
 * @example
 * ```typescript
 * import { apiFetch } from "@/lib/apiClient";
 *
 * // Simple GET request
 * const user = await apiFetch<User>("https://api.example.com/user");
 *
 * // POST request with body
 * await apiFetch("https://api.example.com/update-profile", {
 *   method: "POST",
 *   body: JSON.stringify({ name: "John Doe" }),
 * });
 * ```
 */
export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken.toString();
  console.log(token);

  const headers = {
    ...(options.headers ?? {}),
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response.json() as Promise<T>;
}
