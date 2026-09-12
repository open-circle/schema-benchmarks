import type { InferredDirection, TypesResult } from "@schema-benchmarks/bench";
import { numFormatter } from "@schema-benchmarks/utils";
import { useNavigate } from "@tanstack/react-router";
import bem from "react-bem-helper";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count.tsx";
import { typeMatchLabels } from "#src/routes/typescript/-constants.ts";
import { Button } from "#src/shared/components/button/index.tsx";
import { CodeBlock } from "#src/shared/components/code/index.tsx";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "#src/shared/components/dialog/index.tsx";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter.ts";

export interface TypesDetailProps {
  result: TypesResult | undefined;
}

const cls = bem("types-detail");

function Direction({
  title,
  direction,
  formatCount,
}: {
  title: string;
  direction: InferredDirection;
  formatCount: (value: number) => string;
}) {
  return (
    <section {...cls("section")} aria-label={title}>
      <hgroup {...cls("section-header")}>
        <h4 className="typo-subtitle1">{title}</h4>
        <p className="typo-caption">
          {typeMatchLabels[direction.match].label} · {formatCount(direction.instantiations)}{" "}
          instantiations · {formatCount(direction.chars)} characters
        </p>
      </hgroup>
      <CodeBlock>{direction.snippet}</CodeBlock>
      <CodeBlock showCopy>{direction.text}</CodeBlock>
    </section>
  );
}

export function TypesDetail({ result }: TypesDetailProps) {
  const navigate = useNavigate();
  const formatCount = useNumberFormatter(numFormatter);
  return (
    <Dialog
      open={!!result}
      onClose={() => {
        setTimeout(() => {
          void navigate({
            to: "/typescript",
            search: (old) => ({ ...old, detail: undefined }) as never,
          });
        }, 100);
      }}
      closedby="any"
      aria-labelledby="types-detail-title"
      {...cls()}
    >
      {({ requestClose }) => (
        <>
          {result && (
            <DialogContent {...cls("content")}>
              <div {...cls("header-container")}>
                <hgroup {...cls("header")}>
                  <DialogTitle id="types-detail-title">Inferred types</DialogTitle>
                  <p className="typo-caption">
                    {formatCount(result.instantiations)} instantiations
                  </p>
                </hgroup>
                <hgroup {...cls("header")}>
                  <h4 className="typo-subtitle1">
                    <code className="language-text">{result.libraryName}</code>
                    {result.note ? ` (${result.note})` : null}
                  </h4>
                  <p className="typo-caption">
                    <code className="language-text">{result.version}</code>
                  </p>
                </hgroup>
              </div>
              <dl {...cls("summary")}>
                <div>
                  <dt>Downloads per week</dt>
                  <dd>
                    <DownloadCount libraryName={result.libraryName} />
                  </dd>
                </div>
              </dl>
              <div {...cls("sections")}>
                <section {...cls("section")} aria-label="Type on hover">
                  <hgroup {...cls("section-header")}>
                    <h4 className="typo-subtitle1">Type on hover</h4>
                    <p className="typo-caption">
                      {formatCount(result.schema.instantiations)} instantiations ·{" "}
                      {formatCount(result.schema.chars)} characters
                    </p>
                  </hgroup>
                  <CodeBlock showCopy>{result.schema.text}</CodeBlock>
                </section>
                <Direction title="Input" direction={result.input} formatCount={formatCount} />
                <Direction title="Output" direction={result.output} formatCount={formatCount} />
              </div>
            </DialogContent>
          )}
          <DialogActions>
            <Button onClick={() => requestClose()}>
              <MdSymbol>close</MdSymbol>
              Close
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
