import { create, type Draft } from "mutative";
import { buildUseLocalSlice } from "use-local-slice/buildUseLocalSlice";

interface MutativeHKT extends buildUseLocalSlice.ProduceHKT {
  readonly Draft: Draft<this["State"]>;
  readonly RecipeReturn: void;
}

export const useLocalSlice = buildUseLocalSlice<MutativeHKT>((state, recipe) =>
  create(state, recipe),
);

export namespace useLocalSlice {
  export type PayloadAction<T> = buildUseLocalSlice.PayloadAction<T>;
}
