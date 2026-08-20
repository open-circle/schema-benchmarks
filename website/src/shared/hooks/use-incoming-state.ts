import { castDraft, castMutable } from "mutative";
import type { SetStateAction } from "react";

import type { PayloadAction } from "./use-local-slice";
import { useLocalSlice } from "./use-local-slice";

function isCallback<T>(value: SetStateAction<T>): value is (prevState: T) => T {
  return typeof value === "function";
}

export function useIncomingState<T>(
  incomingValue: T,
  isEqual: (a: T, b: T) => boolean = Object.is,
): [T, (value: SetStateAction<T>) => void] {
  const [{ local, snapshot }, dispatchAction] = useLocalSlice({
    initialState: { snapshot: incomingValue, local: incomingValue },
    reducers: {
      resync: (state, { payload }: PayloadAction<T>) => {
        state.snapshot = castDraft(payload);
        state.local = castDraft(payload);
      },
      setLocal: (state, { payload }: PayloadAction<SetStateAction<T>>) => {
        const newValue = isCallback(payload) ? payload(castMutable(state.local)) : payload;
        state.local = castDraft(newValue);
      },
    },
  });
  if (!isEqual(incomingValue, snapshot)) {
    dispatchAction.resync(incomingValue);
  }
  return [local, dispatchAction.setLocal];
}
