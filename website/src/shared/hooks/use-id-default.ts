import { useId } from "react";

/**
 * Use a meaningful ID if provided, otherwise default to a generated one
 */
export function useIdDefault(id: string | undefined) {
  // rule of hooks means we call this even if we don't need it
  const defaultId = useId();
  return id ?? defaultId;
}
