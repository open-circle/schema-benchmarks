// based on use-local-slice (which uses immer, whereas we use mutative)
/** biome-ignore-all lint/suspicious/noExplicitAny: we only use any as a constraint */

import { create, type Draft } from "mutative";
import { useDebugValue, useMemo, useReducer } from "react";

export type PayloadAction<T> = {
  type: string;
  payload: T;
};

type IfMaybeUndefined<P, True, False> = [undefined] extends [P] ? True : False;

export type PayloadActionDispatch<P = void> = void extends P
  ? () => void
  : IfMaybeUndefined<P, (payload?: P) => void, (payload: P) => void>;

export type ReducerWithoutPayload<S> = (state: S) => S;

export type PayloadActionReducer<S, P = void> = (
  state: Draft<S>,
  action: PayloadAction<P>,
) => void | S | Draft<S>;

export type ReducerMap<State> = {
  [actionType: string]: PayloadActionReducer<State, any>;
};

export type DispatcherMap<Reducers extends ReducerMap<any>> = {
  [T in keyof Reducers]: Reducers[T] extends ReducerWithoutPayload<any>
    ? PayloadActionDispatch<void>
    : Reducers[T] extends PayloadActionReducer<any, infer P>
      ? PayloadActionDispatch<P>
      : never;
};

export interface UseLocalSliceOptions<State, Reducers extends ReducerMap<State>> {
  initialState: State;
  reducers: Reducers;
  slice?: string;
}

export function useLocalSlice<State, Reducers extends ReducerMap<State>>({
  initialState,
  reducers,
  slice = "unnamed",
}: UseLocalSliceOptions<State, Reducers>): [State, DispatcherMap<Reducers>] {
  useDebugValue(slice);

  const [state, dispatch] = useReducer((state, action: PayloadAction<any>) => {
    const reducer = reducers[action.type];
    if (!reducer) return state;
    return create(state, (draft) => reducer(draft, action) as never);
  }, initialState);

  const actionTypes = Object.keys(reducers);

  const dispatchAction = useMemo(() => {
    const map: Record<string, PayloadActionDispatch<NonNullable<unknown>>> = {};
    for (const type of actionTypes) map[type] = (payload) => dispatch({ type, payload });
    return map as DispatcherMap<Reducers>;
  }, [dispatch, JSON.stringify(actionTypes)]);

  return [state, dispatchAction];
}
