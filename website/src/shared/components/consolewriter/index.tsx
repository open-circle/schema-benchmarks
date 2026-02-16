import { setAbortableInterval, setAbortableTimeout } from "@schema-benchmarks/utils";
import { useEffect, useRef } from "react";
import bem from "react-bem-helper";

import { useLocalSlice } from "#/shared/hooks/use-local-slice";
import type { Style } from "#/shared/lib/prefs/constants";

import { useStyle } from "../prefs/context";

type TypeState = "initial" | "typing" | "done";

function useConsoleTyper(
  { children, hidden, interval = 75, delay = interval }: ConsoleWriterProps,
  style: Style,
) {
  const acRef = useRef<AbortController>(undefined);
  const [state, dispatchAction] = useLocalSlice({
    initialState: { index: 0, state: "initial" as TypeState },
    reducers: {
      startTyping: (state) => {
        state.index = 0;
        state.state = "typing";
      },
      nextChar: (state) => {
        state.index++;
        if (state.index >= children.length) {
          state.state = "done";
          acRef.current?.abort();
        }
      },
    },
  });
  useEffect(() => {
    if (!children || hidden || style === "normal") return;
    const ac = new AbortController();
    acRef.current = ac;
    const { signal } = ac;
    setAbortableTimeout(
      () => {
        dispatchAction.startTyping();
        setAbortableInterval(dispatchAction.nextChar, interval, signal);
      },
      delay,
      signal,
    );
    return () => {
      ac.abort();
    };
  }, [children, hidden, style, delay, interval, dispatchAction]);
  return state;
}

export interface ConsoleWriterProps {
  delay?: number;
  interval?: number;
  hidden?: boolean;
  children: string;
}

const cls = bem("console-writer");

export function ConsoleWriter(props: ConsoleWriterProps) {
  const { style } = useStyle();
  const { index, state } = useConsoleTyper(props, style);
  const { children } = props;
  if (style === "normal") return <span>{children}</span>;
  return (
    <span {...cls({ modifiers: [state] })}>
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {children.slice(0, index)}
        <span {...cls("cursor")} data-char={children[index]}></span>
        <span {...cls("hidden")}>{children.slice(index + (state === "typing" ? 1 : 0))}</span>
      </span>
    </span>
  );
}
