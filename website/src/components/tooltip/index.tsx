import {
  autoUpdate,
  type ComputePositionConfig,
  flip,
  useFloating,
  useTransitionStyles,
} from "@floating-ui/react";
import type { Override, WithRequired } from "@schema-benchmarks/utils";
import { bem, mergeRefs } from "@schema-benchmarks/utils/react";
import { radEventListeners } from "rad-event-listeners";
import {
  type ComponentProps,
  type ComponentType,
  type HTMLAttributes,
  type JSX,
  type ReactNode,
  type RefCallback,
  useEffect,
  useState,
} from "react";
import { useIdDefault } from "@/hooks/use-id-default";
import { ButtonGroup } from "../button";

const cls = bem("tooltip");

type TooltipableComponent = ComponentType<
  { ref: RefCallback<HTMLElement> } & Pick<
    HTMLAttributes<HTMLElement>,
    "id" | "popoverTarget" | "popoverTargetAction" | "aria-labelledby"
  >
>;

export interface TooltipOpts extends ComputePositionConfig {
  /** Require a tooltip prop to be set */
  required?: boolean;
  /** Delay before showing the tooltip */
  delay?: number;
}

export interface RichTooltipProps {
  subhead?: string;
  supporting: ReactNode;
  actions?: ReactNode;
  actionsLabel?: string;
}

export interface TooltipProps {
  tooltip?: string | RichTooltipProps;
  tooltipOpts?: ComputePositionConfig;
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
  { delay = 1000, ...opts }: TooltipOpts = {},
) {
  return function WithTooltip({
    tooltip,
    tooltipOpts,
    id: idProp,
    ref,
    ...props
  }: Override<ComponentProps<TComp>, TooltipProps>) {
    const id = useIdDefault(idProp);
    const [open, setOpen] = useState(false);
    const { refs, floatingStyles, context } = useFloating({
      open,
      whileElementsMounted: autoUpdate,
      middleware: [flip({ padding: 24 })],
      ...opts,
      ...tooltipOpts,
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
    const [popoverRef, setPopoverRef] = useState<HTMLElement | null>(null);
    useEffect(() => {
      if (targetRef && popoverRef && tooltip) {
        let timeout: ReturnType<typeof setTimeout> | undefined;
        function open(immediate = false) {
          clearTimeout(timeout);
          timeout = setTimeout(
            () => {
              popoverRef?.showPopover();
              currentId = id;
            },
            currentId || immediate ? 0 : delay,
          );
        }
        function close() {
          clearTimeout(timeout);
          popoverRef?.hidePopover();
          setTimeout(() => {
            if (currentId === id) {
              currentId = "";
            }
          }, 1000);
        }
        const unsubTarget = radEventListeners(targetRef, {
          mouseenter(_event, signal) {
            open();
            const unsubDoc = radEventListeners(
              document,
              {
                mousemove(event) {
                  if (
                    !targetRef?.contains(event.target as Node) &&
                    !popoverRef?.contains(event.target as Node)
                  ) {
                    unsubDoc();
                    close();
                  }
                },
              },
              { signal },
            );
          },
          focus(event) {
            event.preventDefault();
            open(true);
          },
          blur: close,
          keydown(event) {
            if (event.key === "Escape") close();
          },
        });
        return () => {
          unsubTarget();
          close();
        };
      }
    }, [targetRef, popoverRef, tooltip, delay, id]);
    return (
      <>
        <Component
          popoverTargetAction="show"
          // biome-ignore lint/suspicious/noExplicitAny: nastiness
          {...(props as any)}
          ref={mergeRefs(ref, refs.setReference, setTargetRef)}
          {...(tooltip
            ? ({
                "aria-labelledby": id,
                popoverTarget: id,
              } satisfies HTMLAttributes<HTMLElement>)
            : {})}
        />
        {tooltip && (
          <div
            role="tooltip"
            ref={mergeRefs(setPopoverRef, refs.setFloating)}
            popover="hint"
            id={id}
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
                    <h6
                      className={cls({
                        element: "subhead",
                        extra: "typo-caption",
                      })}
                    >
                      {tooltip.subhead}
                    </h6>
                  )}
                  <div className={cls("supporting")}>{tooltip.supporting}</div>
                  {tooltip.actions && (
                    <ButtonGroup
                      className={cls("actions")}
                      ariaLabel={tooltip.actionsLabel ?? "Actions"}
                    >
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
