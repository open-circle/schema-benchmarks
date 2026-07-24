import { Suspense } from "react";

import { highlightFrame } from "#src/routes/_benchmarks/stack/-constants";
import { ToggleButton } from "#src/shared/components/button/toggle";
import { AnsiBlock } from "#src/shared/components/code/ansi";
import { Spinner } from "#src/shared/components/spinner";
import { MdSymbol } from "#src/shared/components/symbol";

export interface OutputProps {
  output: string;
}

export function Output({ output }: OutputProps) {
  return (
    <ToggleButton
      tooltip={{
        subhead: "Error output",
        supporting: (
          <Suspense fallback={<Spinner />}>
            <div className="output">
              <AnsiBlock lineNumbers>{highlightFrame(output)}</AnsiBlock>
            </div>
          </Suspense>
        ),
      }}
    >
      <MdSymbol>terminal</MdSymbol>
    </ToggleButton>
  );
}
