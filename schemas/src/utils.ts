import type { ProductData } from "./data.ts";

export const makeResultEnum = <TFailure extends {}, TSuccess extends {}>(
  failure: TFailure,
  success: (data: ProductData) => TSuccess,
) => ({
  true: success,
  false: failure as TFailure & {
    [K in Exclude<keyof TSuccess, keyof TFailure>]?: never;
  },
});

export const success = makeResultEnum({ success: false }, (value) => ({ success: true, value }));

export const ok = makeResultEnum({ ok: false }, (value) => ({ ok: true, value }));
