import { it } from "@test/browser/fixtures";
import { describe, expect, vi } from "vitest";
import { renderHook } from "vitest-browser-react";
import { useAsyncDisposable, useDisposable } from "./use-disposable";

describe("useDisposable", () => {
  it("should call dispose on the previous value when the dependencies change", async () => {
    let dispose: (() => void) | undefined;
    const { result, rerender } = await renderHook(
      ({ value = 1 }: { value?: number } = {}) => {
        const ownDispose = vi.fn();
        dispose ??= ownDispose;
        return useDisposable(
          () => ({
            value,
            [Symbol.dispose]: ownDispose,
          }),
          [value, ownDispose],
        );
      },
      { initialProps: { value: 1 } },
    );
    expect(result.current).toEqual({
      value: 1,
      [Symbol.dispose]: dispose,
    });
    expect(dispose).not.toHaveBeenCalled();
    rerender({ value: 2 });
    expect(dispose).toHaveBeenCalled();
  });

  it("should call dispose when the component unmounts", async () => {
    const dispose = vi.fn();
    const { unmount } = await renderHook(() => {
      return useDisposable(
        () => ({
          [Symbol.dispose]: dispose,
        }),
        [],
      );
    });
    expect(dispose).not.toHaveBeenCalled();
    unmount();
    expect(dispose).toHaveBeenCalled();
  });
});

describe("useAsyncDisposable", () => {
  it("should call asyncDispose on the previous value when the dependencies change", async () => {
    let asyncDispose: (() => Promise<void>) | undefined;
    const { result, rerender } = await renderHook(
      ({ value = 1 }: { value?: number } = {}) => {
        const ownAsyncDispose = vi.fn(() => Promise.resolve());
        asyncDispose ??= ownAsyncDispose;
        return useAsyncDisposable(
          () => ({
            value,
            [Symbol.asyncDispose]: ownAsyncDispose,
          }),
          [value, ownAsyncDispose],
        );
      },
      { initialProps: { value: 1 } },
    );
    expect(result.current).toEqual({
      value: 1,
      [Symbol.asyncDispose]: asyncDispose,
    });
    expect(asyncDispose).not.toHaveBeenCalled();
    rerender({ value: 2 });
    expect(asyncDispose).toHaveBeenCalled();
  });

  it("should call asyncDispose when the component unmounts", async () => {
    const asyncDispose = vi.fn(() => Promise.resolve());
    const { unmount } = await renderHook(() => {
      return useAsyncDisposable(
        () => ({
          [Symbol.asyncDispose]: asyncDispose,
        }),
        [],
      );
    });
    expect(asyncDispose).not.toHaveBeenCalled();
    unmount();
    expect(asyncDispose).toHaveBeenCalled();
  });
});
