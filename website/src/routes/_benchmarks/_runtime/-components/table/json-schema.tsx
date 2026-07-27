import { Suspense } from "react";

import { ToggleButton } from "#src/shared/components/button/toggle";
import { CodeBlock } from "#src/shared/components/code";
import { Spinner } from "#src/shared/components/spinner";
import { MdSymbol } from "#src/shared/components/symbol";

export interface GeneratedJsonSchemaProps {
  jsonSchema: string;
}

/** Shows the JSON schema a library generated, which varies a lot between libraries. */
export function GeneratedJsonSchema({ jsonSchema }: GeneratedJsonSchemaProps) {
  return (
    <ToggleButton
      tooltip={{
        subhead: "Generated JSON schema",
        supporting: (
          <Suspense fallback={<Spinner />}>
            <div className="snippet">
              <CodeBlock language="json">{jsonSchema}</CodeBlock>
            </div>
          </Suspense>
        ),
      }}
    >
      <MdSymbol>data_object</MdSymbol>
    </ToggleButton>
  );
}
