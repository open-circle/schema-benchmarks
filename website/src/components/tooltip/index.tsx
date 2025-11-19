import {
  autoUpdate,
  flip,
  offset,
  useFloating,
  useTransitionStyles,
} from "@floating-ui/react";
import {
  bem,
  mergeRefs,
  type Override,
  type WithRequired,
} from "@schema-benchmarks/utils";
import { radEventListeners } from "rad-event-listeners";
import {
  type ComponentProps,
  type ComponentType,
  type HTMLAttributes,
  type JSX,
  type RefCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

const cls = bem("tooltip");

type TooltipableComponent = ComponentType<
  { ref: RefCallback<HTMLElement> } & Pick<
    HTMLAttributes<HTMLElement>,
    "id" | "popoverTarget"
  >
>;

export interface TooltipOpts {
  /** Require a tooltip prop to be set */
  required?: boolean;
  /** Delay before showing the tooltip */
  delay?: number;
  /** Delay before hiding the tooltip */
  hideDelay?: number;
  /** Offset from the target */
  offset?: number;
}

export interface TooltipProps {
  title?: string;
  id?: string;
}

/* there is a tooltip open in the page */
let globalOpen = false;

// https://tkdodo.eu/blog/tooltip-components-should-not-exist

export function withTooltip<TComp extends TooltipableComponent>(
  Component: TComp,
  opts: Override<TooltipOpts, { required: true }>,
): (
  props: Override<ComponentProps<TComp>, WithRequired<TooltipProps, "title">>,
) => JSX.Element;
export function withTooltip<TComp extends TooltipableComponent>(
  Component: TComp,
  opts?: TooltipOpts,
): (props: Override<ComponentProps<TComp>, TooltipProps>) => JSX.Element;
export function withTooltip<TComp extends TooltipableComponent>(
  Component: TComp,
  { delay = 250, hideDelay = 75, offset: offsetOpt = 4 }: TooltipOpts = {},
) {
  return function WithTooltip({
    title,
    id,
    ref,
    ...props
  }: Override<ComponentProps<TComp>, TooltipProps>) {
    const autoId = useId();
    const resolvedId = id ?? autoId;
    const [open, setOpen] = useState(false);
    const { refs, floatingStyles, context } = useFloating({
      open,
      whileElementsMounted: autoUpdate,
      middleware: [flip({ padding: 24 }), offset(offsetOpt)],
    });
    const { styles } = useTransitionStyles(context, {
      duration: 75,
      initial: {
        opacity: 0,
        transform: "scale(0.8)",
        transitionTimingFunction: "var(--enter-curve)",
      },
      open: {
        opacity: 1,
        transform: "scale(1)",
      },
    });
    const [targetRef, setTargetRef] = useState<HTMLElement | null>(null);
    const popoverRef = useRef<HTMLElement>(null);
    useEffect(() => {
      if (targetRef && title) {
        let timeout: ReturnType<typeof setTimeout> | undefined;
        const unsub = radEventListeners(targetRef, {
          mouseenter() {
            clearTimeout(timeout);
            timeout = setTimeout(
              () => {
                popoverRef.current?.showPopover();
                globalOpen ||= true;
              },
              globalOpen ? 0 : delay,
            );
          },
          mouseleave() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              popoverRef.current?.hidePopover();
              globalOpen ||= false;
            }, hideDelay);
          },
        });
        return () => {
          unsub();
          clearTimeout(timeout);
          popoverRef.current?.hidePopover();
          globalOpen ||= false;
        };
      }
    }, [targetRef, title, delay, hideDelay]);
    return (
      <>
        <Component
          // biome-ignore lint/suspicious/noExplicitAny: nastiness
          {...(props as any)}
          ref={mergeRefs(ref, refs.setReference, setTargetRef)}
          popoverTarget={resolvedId}
        />
        {title && (
          <div
            ref={mergeRefs(popoverRef, refs.setFloating)}
            popover="hint"
            id={resolvedId}
            style={floatingStyles}
            className={cls()}
            onBeforeToggle={(e) => {
              setOpen(e.newState === "open");
            }}
          >
            <div className={cls("content")} style={styles}>
              {title}
            </div>
          </div>
        )}
      </>
    );
  };
}
