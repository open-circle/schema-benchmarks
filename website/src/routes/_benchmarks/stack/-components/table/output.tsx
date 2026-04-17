import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

import { ToggleButton } from "#/shared/components/button/toggle";
import { getAnsiBlock } from "#/shared/components/code/ansi";
import { Spinner } from "#/shared/components/spinner";
import { MdSymbol } from "#/shared/components/symbol";

import { highlightFrame } from "../../-constants";

export interface OutputProps {
  output: string;
}

export function Output({ output }: OutputProps) {
  const { data } = useSuspenseQuery(
    getAnsiBlock({ children: highlightFrame(output), lineNumbers: true }),
  );
  return (
    <ToggleButton
      tooltip={{
        subhead: "Error output",
        supporting: (
          <Suspense fallback={<Spinner />}>
            <div className="output">{data}</div>
          </Suspense>
        ),
      }}
    >
      <MdSymbol>terminal</MdSymbol>
    </ToggleButton>
  );
}
