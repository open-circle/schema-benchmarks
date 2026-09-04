import type { JsonComplianceResult } from "@schema-benchmarks/bench";
import type { ComplianceTarget } from "@schema-benchmarks/json-schema-tests/types";
import { percentFormatter, shortNumFormatter, partition } from "@schema-benchmarks/utils";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import bem from "react-bem-helper";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count.tsx";
import { JsonSchemaSourceText } from "#src/routes/json-schema/-components/source.tsx";
import {
  complianceTargetProps,
  ensureComplianceTab,
  processCount,
} from "#src/routes/json-schema/compliance/-constants.tsx";
import { Button } from "#src/shared/components/button/index.tsx";
import { ResponsiveCodeBlock } from "#src/shared/components/code/index.tsx";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "#src/shared/components/dialog/index.tsx";
import {
  List,
  ListItem,
  ListItemContent,
  ListItemExternalLink,
} from "#src/shared/components/list/index.tsx";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import { Pie } from "#src/shared/components/table/pie.tsx";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter.ts";
import { trackedLinkProps } from "#src/shared/lib/analytics.ts";

export interface ComplianceDetailProps {
  target: ComplianceTarget;
  result: JsonComplianceResult | undefined;
}
const cls = bem("json-schema-compliance-detail");

export function ComplianceDetail({ result, target }: ComplianceDetailProps) {
  const open = !!result;
  const navigate = useNavigate();
  const formatNumber = useNumberFormatter(shortNumFormatter);
  const formatPercentage = useNumberFormatter(percentFormatter);
  const [optional, spec] = useMemo(
    () => partition(Object.entries(result?.results.files ?? {}), ([file]) => file.includes("/")),
    [result?.results.files],
  );
  const processedSpec = result && processCount(result.results.byType.spec);
  const processedOptional = result && processCount(result.results.byType.optional);
  return (
    <Dialog
      open={open}
      onClose={() => {
        setTimeout(() => {
          void navigate({
            to: "/json-schema/compliance/$tab",
            params: ({ tab }) => ({ tab: ensureComplianceTab(tab) }),
            search: (old) => ({ ...old, detail: undefined }) as never,
          });
        }, 100);
      }}
      closedby="any"
      aria-labelledby="json-schema-compliance-detail-title"
      {...cls()}
    >
      {({ requestClose }) => (
        <>
          {result && processedSpec && processedOptional && (
            <DialogContent {...cls("content")}>
              <div {...cls("header-container")}>
                <hgroup {...cls("header")}>
                  <DialogTitle id="json-schema-compliance-detail-title">Compliance</DialogTitle>
                  <p {...cls({ element: "target", extra: "typo-caption" })}>
                    {complianceTargetProps.labels[target].label}
                  </p>
                </hgroup>
                <hgroup {...cls("header")}>
                  <h4 {...cls({ element: "library", extra: "typo-subtitle1" })}>
                    <code className="language-text">{result.libraryName}</code>
                    {result.note ? ` (${result.note})` : null}
                  </h4>
                  <p {...cls({ element: "version", extra: "typo-caption" })}>
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
                <div>
                  <dt>Source</dt>
                  <dd>
                    <JsonSchemaSourceText source={result.source} />
                  </dd>
                </div>
              </dl>
              <div {...cls("details-container")}>
                <ResponsiveCodeBlock>{result.snippet}</ResponsiveCodeBlock>
                <details {...cls("details")}>
                  <summary {...cls("details-summary")}>
                    <ListItemContent
                      lines={2}
                      primary="Specification coverage"
                      supporting={`${formatPercentage(processedSpec.pct)} (${formatNumber(processedSpec.passed)}/${formatNumber(processedSpec.total)})`}
                      leading={<Pie value={processedSpec.pct} max={1} showIcon />}
                    />
                  </summary>
                  <List {...cls("files")}>
                    {spec.map(([file, result]) => {
                      const { passed, total, pct } = processCount(result.count);
                      return (
                        <ListItem key={file}>
                          <ListItemExternalLink
                            {...trackedLinkProps(
                              `https://github.com/json-schema-org/JSON-Schema-Test-Suite/blob/main/tests/${target}/${file}` +
                                ".json",
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ListItemContent
                              lines={1}
                              leading={<Pie value={pct} max={1} showIcon />}
                              trailing={
                                <span className="typo-caption">{`${formatPercentage(pct)} (${formatNumber(passed)}/${formatNumber(total)})`}</span>
                              }
                            >
                              <code className="language-text">{file}</code>
                            </ListItemContent>
                          </ListItemExternalLink>
                        </ListItem>
                      );
                    })}
                  </List>
                </details>
                {optional.length > 0 && (
                  <details {...cls("details")}>
                    <summary {...cls("details-summary")}>
                      <ListItemContent
                        lines={2}
                        primary="Optional formats and proposals"
                        supporting={`${formatPercentage(processedOptional.pct)} (${formatNumber(processedOptional.passed)}/${formatNumber(processedOptional.total)})`}
                        leading={<Pie value={processedOptional.pct} max={1} showIcon />}
                      />
                    </summary>
                    <List {...cls("files")}>
                      {optional.map(([file, result]) => {
                        const { passed, total, pct } = processCount(result.count);
                        const pathSegments = file.split("/");
                        if (pathSegments[0] === "optional") {
                          pathSegments.shift();
                        }
                        const lastSegment = pathSegments.pop();
                        const hasPath = pathSegments.length > 0;
                        return (
                          <ListItem key={file}>
                            <ListItemExternalLink
                              {...trackedLinkProps(
                                `https://github.com/json-schema-org/JSON-Schema-Test-Suite/blob/main/tests/${target}/${file}` +
                                  ".json",
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {hasPath ? (
                                <ListItemContent
                                  lines={2}
                                  overline={
                                    <code className="language-text">{pathSegments.join("/")}</code>
                                  }
                                  primary={<code className="language-text">{lastSegment}</code>}
                                  leading={<Pie value={pct} max={1} showIcon />}
                                  trailing={
                                    <span className="typo-caption">{`${formatPercentage(pct)} (${formatNumber(passed)}/${formatNumber(total)})`}</span>
                                  }
                                />
                              ) : (
                                <ListItemContent
                                  lines={1}
                                  leading={<Pie value={pct} max={1} showIcon />}
                                  trailing={
                                    <span className="typo-caption">{`${formatPercentage(pct)} (${formatNumber(passed)}/${formatNumber(total)})`}</span>
                                  }
                                >
                                  <code className="language-text">{lastSegment}</code>
                                </ListItemContent>
                              )}
                            </ListItemExternalLink>
                          </ListItem>
                        );
                      })}
                    </List>
                  </details>
                )}
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
