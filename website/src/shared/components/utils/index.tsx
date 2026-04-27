import { clsx, ClassValue } from "clsx";
import { ComponentPropsWithRef, ElementType, FunctionComponent, JSX } from "react";

type ClassFunction<Props> = (props: Props) => ClassValue;

function classedImpl<TComp extends ElementType<{ className: string }>>(
  Component: TComp,
  classes: ClassValue | ClassFunction<ComponentPropsWithRef<TComp>>,
): FunctionComponent<ComponentPropsWithRef<TComp>> {
  return function ClassedComponent(props) {
    return (
      <Component
        {...(props as any)}
        className={clsx(typeof classes === "function" ? classes(props) : classes, props.className)}
      />
    );
  };
}

export const classed = new Proxy(
  classedImpl as typeof classedImpl & {
    [Tag in keyof JSX.IntrinsicElements]: (
      classes: ClassValue | ClassFunction<JSX.IntrinsicElements[Tag]>,
    ) => FunctionComponent<JSX.IntrinsicElements[Tag]>;
  },
  {
    get(target, prop, receiver) {
      if (typeof prop !== "string" || Reflect.has(target, prop))
        return Reflect.get(target, prop, receiver);
      return (classes: ClassValue | ClassFunction<any>) =>
        classedImpl(prop as keyof JSX.IntrinsicElements, classes);
    },
  },
);
