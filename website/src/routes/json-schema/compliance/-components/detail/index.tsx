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
} from "#src/routes/json-schema/compliance/-constants.tsx";
import { Button } from "#src/shared/components/button/index.tsx";
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
    () =>
      partition(Object.entries(result?.results.files ?? {}), ([file]) =>
        file.startsWith("optional"),
      ),
    [result?.results.files],
  );
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
      {...cls()}
    >
      {({ requestClose }) => (
        <>
          {result && (
            <DialogContent {...cls("content")}>
              <hgroup {...cls("header")}>
                <p {...cls({ element: "version", extra: "typo-overline" })}>
                  <code className="language-text">{result.version}</code>
                </p>
                <DialogTitle>
                  <code className="language-text">{result.libraryName}</code>
                  {result.note ? ` (${result.note})` : null}
                </DialogTitle>
                <p {...cls({ element: "target", extra: "typo-caption" })}>
                  {complianceTargetProps.labels[target].label}
                </p>
              </hgroup>
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
                <details {...cls("details")}>
                  <summary {...cls("details-summary")}>Specification coverage</summary>
                  <List {...cls("files")}>
                    {spec.map(([file, result]) => {
                      const { passed, failed } = result.count;
                      const total = passed + failed;
                      const percentage = passed / total;
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
                              leading={<Pie value={percentage} max={1} showIcon />}
                              trailing={
                                <span className="typo-caption">{`${formatPercentage(percentage)} (${formatNumber(passed)}/${formatNumber(total)})`}</span>
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
                    <summary {...cls("details-summary")}>Optional formats and proposals</summary>
                    <List {...cls("files")}>
                      {optional.map(([file, result]) => {
                        const { passed, failed } = result.count;
                        const total = passed + failed;
                        const percentage = passed / total;
                        const isFormat = file.startsWith("optional/format/");
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
                              {isFormat ? (
                                <ListItemContent
                                  lines={2}
                                  overline="Format"
                                  primary={
                                    <code className="language-text">
                                      {file.replace("optional/format/", "")}
                                    </code>
                                  }
                                  leading={<Pie value={percentage} max={1} showIcon />}
                                  trailing={
                                    <span className="typo-caption">{`${formatPercentage(percentage)} (${formatNumber(passed)}/${formatNumber(total)})`}</span>
                                  }
                                />
                              ) : (
                                <ListItemContent
                                  lines={1}
                                  leading={<Pie value={percentage} max={1} showIcon />}
                                  trailing={
                                    <span className="typo-caption">{`${formatPercentage(percentage)} (${formatNumber(passed)}/${formatNumber(total)})`}</span>
                                  }
                                >
                                  <code className="language-text">
                                    {file.replace("optional/", "")}
                                  </code>
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
