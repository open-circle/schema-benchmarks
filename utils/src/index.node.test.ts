import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  formatBytes,
  partition,
  promiseAllKeyed,
  setAbortableInterval,
  setAbortableTimeout,
} from ".";

describe("formatBytes", () => {
  it("should format bytes", () => {
    expect(formatBytes(1)).toBe("1 B");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1024 * 1024)).toBe("1 MB");
    expect(formatBytes(1024 * 1024 * 1024)).toBe("1 GB");
  });
});

describe("partition", () => {
  it("should split the array into two arrays based on the predicate", () => {
    const array = [1, 2, 3, 4, 5];
    const [even, odd] = partition(array, (value) => value % 2 === 0);
    expect(even).toEqual([2, 4]);
    expect(odd).toEqual([1, 3, 5]);
  });
});

describe("promiseAllKeyed", () => {
  it("should create a new object with the same keys as the input", async () => {
    const result = await promiseAllKeyed({
      a: Promise.resolve(1),
      b: Promise.resolve(2),
      c: Promise.resolve(3),
    });
    expect(result).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });
  it("should reject if any promise rejects", async () => {
    await expect(
      promiseAllKeyed({
        a: Promise.resolve(1),
        b: Promise.reject(2),
        c: Promise.resolve(3),
      }),
    ).rejects.toBe(2);
  });
});

describe("setAbortableInterval", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  it("should call the function every `delay` milliseconds, until aborted", async () => {
    const ac = new AbortController();
    const fn = vi.fn();
    const delay = 100;
    setAbortableInterval(fn, delay, ac.signal);
    expect(fn).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(delay);
    expect(fn).toHaveBeenCalledOnce();

    await vi.advanceTimersByTimeAsync(delay);
    expect(fn).toHaveBeenCalledTimes(2);

    ac.abort();
    await vi.advanceTimersByTimeAsync(delay);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe("setAbortableTimeout", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  it("should call the function after `delay` milliseconds, if not aborted", async () => {
    const ac = new AbortController();
    const fn = vi.fn();
    const delay = 100;
    setAbortableTimeout(fn, delay, ac.signal);
    expect(fn).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(delay);
    expect(fn).toHaveBeenCalledOnce();
  });
  it("should not call the function if aborted before `delay`", async () => {
    const ac = new AbortController();
    const fn = vi.fn();
    const delay = 100;
    setAbortableTimeout(fn, delay, ac.signal);
    expect(fn).not.toHaveBeenCalled();

    ac.abort();
    await vi.advanceTimersByTimeAsync(delay);
    expect(fn).not.toHaveBeenCalled();
  });
});
