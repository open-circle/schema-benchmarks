import { Suspense } from "react";

import { ToggleButton } from "#/shared/components/button/toggle";
import { CodeBlock } from "#/shared/components/code";
import { Spinner } from "#/shared/components/spinner";
import { MdSymbol } from "#/shared/components/symbol";

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
