import type { InferredDirection, TypesResult } from "@schema-benchmarks/bench";
import { numFormatter } from "@schema-benchmarks/utils";
import { useNavigate } from "@tanstack/react-router";
import bem from "react-bem-helper";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count.tsx";
import { FromTypeCases } from "#src/routes/typescript/-components/from-type.tsx";
import { fromTypeStyleLabels, typeMatchLabels } from "#src/routes/typescript/-constants.ts";
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

function Section({
  title,
  supporting,
  children,
}: {
  title: string;
  supporting: string;
  children?: React.ReactNode;
}) {
  return (
    <section {...cls("section")} aria-label={title}>
      <hgroup {...cls("section-header")}>
        <h4 className="typo-subtitle1">{title}</h4>
        <p className="typo-caption">{supporting}</p>
      </hgroup>
      {children}
    </section>
  );
}

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
    <Section
      title={title}
      supporting={`${typeMatchLabels[direction.match].label} · ${formatCount(direction.instantiations)} instantiations · ${formatCount(direction.chars)} characters`}
    >
      <CodeBlock>{direction.snippet}</CodeBlock>
      <CodeBlock showCopy>{direction.text}</CodeBlock>
    </Section>
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
                    {result.inference
                      ? `${formatCount(result.inference.instantiations)} instantiations`
                      : "No inference"}
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
                {result.inference ? (
                  <>
                    <Section
                      title="Type on hover"
                      supporting={`${formatCount(result.inference.schema.instantiations)} instantiations · ${formatCount(result.inference.schema.chars)} characters`}
                    >
                      <CodeBlock showCopy>{result.inference.schema.text}</CodeBlock>
                    </Section>
                    <Direction
                      title="Input"
                      direction={result.inference.input}
                      formatCount={formatCount}
                    />
                    <Direction
                      title="Output"
                      direction={result.inference.output}
                      formatCount={formatCount}
                    />
                  </>
                ) : (
                  <Section
                    title="Inference"
                    supporting={result.noInference ?? "The library infers no type from a schema."}
                  />
                )}
                <Section
                  title="From an existing type"
                  supporting={
                    result.fromType
                      ? `${fromTypeStyleLabels[result.fromType.style].label}${result.fromType.derived ? " · the schema is generated from the type" : ""}${result.fromType.note ? ` · ${result.fromType.note}` : ""}`
                      : "The library has no way to build a schema from a type that already exists."
                  }
                >
                  {result.fromType && (
                    <>
                      <CodeBlock showCopy>{result.fromType.snippet}</CodeBlock>
                      <FromTypeCases fromType={result.fromType} />
                    </>
                  )}
                </Section>
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
