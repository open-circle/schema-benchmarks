export const mergeRefs = <T extends HTMLElement>(
  ...refs: Array<React.Ref<T> | undefined>
) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return undefined;
  if (filteredRefs.length === 1) return filteredRefs[0];
  return (value: T | null) => {
    for (const ref of filteredRefs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    }
  };
};
