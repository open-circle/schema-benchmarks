import { Checkbox } from "#src/shared/components/checkbox/index.tsx";

export function MatrixCheckbox({ reason }: { reason?: string }) {
  return (
    <Checkbox
      checked={!reason}
      readOnly
      aria-label="Supported"
      tooltip={
        reason && {
          subhead: "Reason for lack of support",
          supporting: reason,
        }
      }
    />
  );
}
