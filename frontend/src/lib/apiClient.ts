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

  let data: Promise<T>;
  try {
    data = (await response.json()) as Promise<T>;
  } catch (error) {
    throw new Error(`API Error: ${(error as Error).message}`);
  }

  return data;
}

/**
 * Performs a DELETE request with the Authorization header automatically attached.
 *
 * This utility is specifically for DELETE operations that typically return empty responses
 * (204 No Content), avoiding JSON parsing errors.
 *
 * @param {string} url - The absolute or relative URL of the API endpoint.
 * @param {Omit<RequestInit, 'method'>} [options] - Optional fetch configuration, excluding method.
 *
 * @returns {Promise<void>} - A promise that resolves when the delete is successful.
 *
 * @throws {Error} - Throws an error if the response is not OK (status >= 400).
 *
 * @example
 * ```typescript
 * import { apiDelete } from "@/lib/apiClient";
 *
 * await apiDelete("https://api.example.com/user/123");
 * ```
 */
export async function apiDelete(
  url: string,
  options: Omit<RequestInit, "method"> = {},
): Promise<void> {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken.toString();

  const headers = {
    ...(options.headers ?? {}),
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
    ...options,
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  // Don't try to parse response body for DELETE requests
  return;
}
