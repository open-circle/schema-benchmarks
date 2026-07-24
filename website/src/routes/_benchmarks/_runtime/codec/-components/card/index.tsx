import type { CodecResult } from "@schema-benchmarks/bench";
import { durationFormatter, getDuration, getTransitionName } from "@schema-benchmarks/utils";
import { Fragment } from "react";
import bem from "react-bem-helper";
import { ErrorBoundary } from "react-error-boundary";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { optimizeTypeProps } from "#src/routes/_benchmarks/_runtime/-constants";
import { ToggleButton } from "#src/shared/components/button/toggle";
import { ChipCollection, DisplayChip } from "#src/shared/components/chip";
import { CodeBlock } from "#src/shared/components/code";
import { MdSymbol } from "#src/shared/components/symbol";
import { Bar } from "#src/shared/components/table/bar";

interface CodecCardProps {
  encodeScaler: ReturnType<typeof Bar.getScale>;
  decodeScaler: ReturnType<typeof Bar.getScale>;
  result: CodecResult;
}

export const cls = bem("bench-card");

export function CodecCard({ result, encodeScaler, decodeScaler }: CodecCardProps) {
  const id = `codec-card-${result.id}`;
  return (
    <li id={id} aria-labelledby={`${id}-header`} data-testid="bench-card">
      <article
        {...cls()}
        style={{
          viewTransitionName: getTransitionName("bench-card", {
            libraryName: result.libraryName,
            note: result.note,
          }),
        }}
      >
        <h5 {...cls({ element: "version", extra: "typo-overline" })}>{result.version}</h5>
        <div {...cls("header-row")}>
          <header {...cls("library-name")} id={`${id}-header`}>
            <h4 className="typo-headline5">
              <code className="language-text">{result.libraryName}</code>
            </h4>
            {result.note && (
              <p {...cls({ element: "note", extra: "typo-caption" })}>({result.note})</p>
            )}
          </header>
          <ErrorBoundary fallback={null}>
            <div {...cls({ element: "downloads", extra: "typo-body2" })}>
              <MdSymbol>download</MdSymbol>
              <DownloadCount libraryName={result.libraryName} />
              {" / wk"}
            </div>
          </ErrorBoundary>
        </div>
        {(["encode", "decode"] as const).map((type) => {
          const { snippet, mean } = result[type];
          const scaler = type === "encode" ? encodeScaler : decodeScaler;
          return (
            <Fragment key={type}>
              <h6 {...cls({ element: "code-title", extra: "typo-subtitle2" })}>
                {type === "encode" ? "Encode" : "Decode"}
              </h6>
              <CodeBlock>{snippet}</CodeBlock>
              <dl className="minimal">
                <div>
                  <dt>Mean</dt>
                  <dd>{durationFormatter.format(getDuration(mean))}</dd>
                </div>
              </dl>
              <div {...cls("bar")}>
                <Bar {...scaler(mean)} />
              </div>
            </Fragment>
          );
        })}
        <div {...cls("chips")}>
          <ChipCollection data-testid="bench-card-chips">
            <DisplayChip>
              <MdSymbol>{optimizeTypeProps.labels[result.optimizeType].icon}</MdSymbol>
              {optimizeTypeProps.labels[result.optimizeType].label}
            </DisplayChip>
          </ChipCollection>
          {result.acceptsUnknown && (
            <ToggleButton
              tooltip={{
                subhead: "Accepts unknown values",
                supporting: "This codec allows unknown input, requiring extra validation.",
              }}
            >
              <MdSymbol>warning</MdSymbol>
            </ToggleButton>
          )}
        </div>
      </article>
    </li>
  );
}
