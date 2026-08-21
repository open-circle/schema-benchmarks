import { describe, expect, it } from "vitest";

import {
  externalApiRetryOptions,
  getRetryDelay,
  getRequestUrl,
  isAbortError,
  isRetryableNetworkError,
  isRetryableStatusCode,
  isRetryableUpfetchError,
  parseRetryAfterMs,
  shouldRetryByDefault,
  shouldRetryRequest,
} from "./fetch";

const makeResponse = (retryAfter?: string) =>
  new Response(null, {
    headers: retryAfter ? { "retry-after": retryAfter } : undefined,
  });

describe("retry status classification", () => {
  it("wires the exported callbacks into the external retry options", () => {
    expect(externalApiRetryOptions.attempts).toBe(4);
    expect(externalApiRetryOptions.when).toBe(shouldRetryRequest);
    expect(externalApiRetryOptions.delay).toBe(getRetryDelay);
  });

  it.each([408, 425, 429, 500, 502, 503, 504])("accepts HTTP %i", (status) => {
    expect(isRetryableStatusCode(status)).toBe(true);
    expect(shouldRetryRequest({ response: new Response(null, { status }), error: undefined })).toBe(
      true,
    );
  });

  it.each([400, 401, 403, 404])("rejects HTTP %i", (status) => {
    expect(isRetryableStatusCode(status)).toBe(false);
    expect(shouldRetryRequest({ response: new Response(null, { status }), error: undefined })).toBe(
      false,
    );
  });
});

describe("retry delay", () => {
  it("uses Retry-After seconds when present", () => {
    expect(parseRetryAfterMs(makeResponse("2.5"))).toBe(2500);
    expect(getRetryDelay({ attempt: 1, response: makeResponse("2.5") })).toBe(2500);
  });

  it("uses HTTP dates and clamps negative delays to zero", () => {
    expect(parseRetryAfterMs(makeResponse("Thu, 01 Jan 1970 00:00:00 GMT"))).toBe(0);
  });

  it("falls back to capped exponential backoff", () => {
    expect(getRetryDelay({ attempt: 1 })).toBe(300);
    expect(getRetryDelay({ attempt: 3 })).toBe(1200);
    expect(getRetryDelay({ attempt: 7 })).toBe(10_000);
    expect(getRetryDelay({ attempt: 1, response: makeResponse("20") })).toBe(10_000);
  });
});

describe("retry error classification", () => {
  it("recognizes network and timeout errors", () => {
    expect(isRetryableNetworkError(new TypeError("network failed"))).toBe(true);
    expect(isRetryableNetworkError({ name: "TimeoutError" })).toBe(true);
    expect(isRetryableUpfetchError(new TypeError("network failed"))).toBe(true);
  });

  it("excludes abort and unrelated errors", () => {
    const abortError = new DOMException("aborted", "AbortError");

    expect(isAbortError(abortError)).toBe(true);
    expect(shouldRetryRequest({ response: undefined, error: abortError })).toBe(false);
    expect(isRetryableUpfetchError(new Error("bad response"))).toBe(false);
    expect(isRetryableUpfetchError(null)).toBe(false);
  });
});

describe("retry URL selection", () => {
  it("selects external HTTPS URLs only", () => {
    expect(getRequestUrl(new URL("https://api.example.test/data"))).toBe(
      "https://api.example.test/data",
    );
    expect(getRequestUrl(new Request("https://api.example.test/data"))).toBe(
      "https://api.example.test/data",
    );
    expect(shouldRetryByDefault("https://api.example.test/data")).toBe(true);
    expect(shouldRetryByDefault("http://api.example.test/data")).toBe(false);
  });
});
