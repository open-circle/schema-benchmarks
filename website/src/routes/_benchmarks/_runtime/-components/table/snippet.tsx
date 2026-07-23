import { Suspense } from "react";

import { ToggleButton } from "#src/shared/components/button/toggle";
import { CodeBlock } from "#src/shared/components/code";
import { Spinner } from "#src/shared/components/spinner";
import { MdSymbol } from "#src/shared/components/symbol";

export interface SnippetProps {
  code: string;
}

export function Snippet({ code }: SnippetProps) {
  return (
    <ToggleButton
      tooltip={{
        subhead: "Code snippet",
        supporting: (
          <Suspense fallback={<Spinner />}>
            <div className="snippet">
              <CodeBlock>{code}</CodeBlock>
              {(code.startsWith("//") || code.startsWith("/*")) && (
                <p>(Commented code is not benchmarked)</p>
              )}
            </div>
          </Suspense>
        ),
      }}
    >
      <MdSymbol>code</MdSymbol>
    </ToggleButton>
  );
}
