export function getVerticalOffsets<T>(
  data: ReadonlyArray<T>,
  getGroup: (datum: T) => string,
  getKey: (datum: T) => string,
  spacing = 6,
) {
  const offsets = new Map<string, number>();

  for (const values of Map.groupBy(data, getGroup).values()) {
    const center = (values.length - 1) / 2;
    values.forEach((datum, index) => offsets.set(getKey(datum), (index - center) * spacing));
  }

  return offsets;
}
