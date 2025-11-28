import {
  autoUpdate,
  flip,
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
  type ReactNode,
  type RefCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { ButtonGroup } from "../button";

const cls = bem("tooltip");

type TooltipableComponent = ComponentType<
  { ref: RefCallback<HTMLElement> } & Pick<
    HTMLAttributes<HTMLElement>,
    "id" | "popoverTarget" | "aria-labelledby"
  >
>;

export interface TooltipOpts {
  /** Require a tooltip prop to be set */
  required?: boolean;
  /** Delay before showing the tooltip */
  delay?: number;
  /** Offset from the target */
  offset?: number;
}

export interface RichTooltipProps {
  subhead?: string;
  supporting: ReactNode;
  actions?: ReactNode;
}

export interface TooltipProps {
  tooltip?: string | RichTooltipProps;
  id?: string;
}

let currentId = "";

// https://tkdodo.eu/blog/tooltip-components-should-not-exist

export function withTooltip<TComp extends TooltipableComponent>(
  Component: TComp,
  opts: Override<TooltipOpts, { required: true }>,
): (
  props: Override<ComponentProps<TComp>, WithRequired<TooltipProps, "tooltip">>,
) => JSX.Element;
export function withTooltip<TComp extends TooltipableComponent>(
  Component: TComp,
  opts?: TooltipOpts,
): (props: Override<ComponentProps<TComp>, TooltipProps>) => JSX.Element;
export function withTooltip<TComp extends TooltipableComponent>(
  Component: TComp,
  { delay = 1000 }: TooltipOpts = {},
) {
  return function WithTooltip({
    tooltip,
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
      middleware: [flip({ padding: 24 })],
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
      if (targetRef && tooltip) {
        let timeout: ReturnType<typeof setTimeout> | undefined;
        function open(immediate = false) {
          clearTimeout(timeout);
          timeout = setTimeout(
            () => {
              popoverRef.current?.showPopover();
              currentId = resolvedId;
            },
            currentId || immediate ? 0 : delay,
          );
        }
        function close() {
          clearTimeout(timeout);
          popoverRef.current?.hidePopover();
          setTimeout(() => {
            if (currentId === resolvedId) {
              currentId = "";
            }
          }, 1000);
        }
        const unsub = radEventListeners(targetRef, {
          mouseenter() {
            open();
          },
          focus(event) {
            event.preventDefault();
            open(true);
          },
          mouseleave: close,
          blur: close,
          keydown(event) {
            if (event.key === "Escape") close();
          },
        });
        return () => {
          unsub();
          close();
        };
      }
    }, [targetRef, tooltip, delay, resolvedId]);
    return (
      <>
        <Component
          // biome-ignore lint/suspicious/noExplicitAny: nastiness
          {...(props as any)}
          ref={mergeRefs(ref, refs.setReference, setTargetRef)}
          {...(tooltip
            ? { "aria-labelledby": resolvedId, popoverTarget: resolvedId }
            : {})}
        />
        {tooltip && (
          <div
            // TODO: make this role="tooltip" compliant
            ref={mergeRefs(popoverRef, refs.setFloating)}
            popover="hint"
            id={resolvedId}
            style={floatingStyles}
            className={cls({
              modifiers: { rich: typeof tooltip === "object" },
            })}
            onBeforeToggle={(e) => {
              setOpen(e.newState === "open");
            }}
          >
            <div className={cls("content")} style={styles}>
              {typeof tooltip === "string" ? (
                tooltip
              ) : (
                <>
                  {tooltip.subhead && (
                    <p className={cls("subhead")}>{tooltip.subhead}</p>
                  )}
                  <p className={cls("supporting")}>{tooltip.supporting}</p>
                  {tooltip.actions && (
                    <ButtonGroup className={cls("actions")}>
                      {tooltip.actions}
                    </ButtonGroup>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
  };
}
