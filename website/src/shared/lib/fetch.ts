import type { QueryClient } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { radEventListeners } from "rad-event-listeners";
import { isResponseError, type RetryOptions, up } from "up-fetch";

export interface PrefetchContext {
  queryClient: QueryClient;
  signal?: AbortSignal;
}

const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);
const MAX_FETCH_RETRIES = 4;
const INITIAL_RETRY_DELAY_MS = 300;
const MAX_RETRY_DELAY_MS = 10_000;

const parseRetryAfterMs = (response: Response): number | undefined => {
  const value = response.headers.get("retry-after");
  if (!value) return undefined;

  const asSeconds = Number(value);
  if (Number.isFinite(asSeconds)) return Math.max(0, Math.ceil(asSeconds * 1000));

  const asDate = Date.parse(value);
  if (Number.isNaN(asDate)) return undefined;
  return Math.max(0, asDate - Date.now());
};

const isAbortError = (error: unknown) =>
  (error instanceof DOMException && error.name === "AbortError") ||
  (typeof error === "object" &&
    error !== null &&
    (error as { name?: unknown }).name === "AbortError");

const isRetryableNetworkError = (error: unknown) =>
  error instanceof TypeError ||
  (typeof error === "object" &&
    error !== null &&
    (error as { name?: unknown }).name === "TimeoutError");

export const isRetryableUpfetchError = (error: unknown) => {
  if (isAbortError(error)) return false;
  if (isResponseError(error)) return RETRYABLE_STATUS_CODES.has(error.status);
  return isRetryableNetworkError(error);
};

const externalApiRetryOptions: RetryOptions = {
  attempts: MAX_FETCH_RETRIES,
  when: ({ response, error }) => {
    if (response) return RETRYABLE_STATUS_CODES.has(response.status);
    if (isAbortError(error)) return false;
    return isRetryableNetworkError(error);
  },
  delay: ({ attempt, response }) => {
    if (response) {
      const retryAfterMs = parseRetryAfterMs(response);
      if (retryAfterMs !== undefined) return Math.min(retryAfterMs, MAX_RETRY_DELAY_MS);
    }

    const exponential = INITIAL_RETRY_DELAY_MS * 2 ** (attempt - 1);
    return Math.min(exponential, MAX_RETRY_DELAY_MS);
  },
};

const getRequestUrl = (input: RequestInfo | URL) => {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  if (input instanceof Request) return input.url;
  return String(input);
};

const shouldRetryByDefault = (input: RequestInfo | URL) => {
  const url = getRequestUrl(input);
  const isExternal =
    url.startsWith("https://") &&
    (typeof location === "undefined" || !url.startsWith(location.origin));
  return isExternal;
};

export const upfetch = up(fetch, (input) => ({
  retry: shouldRetryByDefault(input) ? externalApiRetryOptions : undefined,
}));

export const preloadImage = createIsomorphicFn()
  .client((src: string) => {
    const { promise, resolve, reject } = Promise.withResolvers<void>();
    const image = new Image();
    const unsub = radEventListeners(
      image,
      {
        load: () => resolve(),
        error: (event) => reject((event as ErrorEvent).error),
      },
      { once: true },
    );
    image.src = src;
    return promise.finally(unsub);
  })
  .server(() => Promise.resolve());

export const preloadImages = (sources: Iterable<string>) =>
  Promise.all(Array.from(sources, preloadImage));
