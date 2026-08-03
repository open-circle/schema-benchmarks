import { useRef } from "react";

import { Checkbox } from "#src/shared/components/checkbox/index.tsx";

export function MatrixCheckbox({ reason }: { reason?: string }) {
  const popoverRef = useRef<HTMLElement>(null);
  return (
    <Checkbox
      checked={!reason}
      readOnly
      tooltip={
        reason && {
          subhead: "Reason for lack of support",
          supporting: reason,
        }
      }
      popoverRef={popoverRef}
    />
  );
}
