import { Suspense } from "react";

import { ToggleButton } from "#/shared/components/button/toggle";
import { AnsiBlock } from "#/shared/components/code/ansi";
import { Spinner } from "#/shared/components/spinner";
import { MdSymbol } from "#/shared/components/symbol";

import { highlightFrame } from "../../-constants";

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
              <AnsiBlock>{highlightFrame(output)}</AnsiBlock>
            </div>
          </Suspense>
        ),
      }}
    >
      <MdSymbol>terminal</MdSymbol>
    </ToggleButton>
  );
}
