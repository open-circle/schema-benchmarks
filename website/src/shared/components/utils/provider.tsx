import type { ComponentType, ReactNode } from "react";

type ProviderTuple<Props> = [ComponentType<Props>, Omit<Props, "children">];

type ProviderTuples<Props extends Array<any>> = {
  [Index in keyof Props]: ProviderTuple<Props[Index]>;
};

export interface ProviderProps<Props extends Array<any>> {
  providers: ProviderTuples<Props>;
  children: ReactNode;
}

export function Providers<Props extends Array<any>>({ providers, children }: ProviderProps<Props>) {
  return providers.reduceRight(
    (acc, [Provider, props]) => <Provider {...props}>{acc}</Provider>,
    children,
  );
}
