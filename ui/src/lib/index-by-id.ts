/** One pass from id to item. List rows should read this instead of scanning the array. */
export function indexById<T extends { id: string }>(
  items: readonly T[] | null | undefined,
): ReadonlyMap<string, T> {
  const map = new Map<string, T>();
  for (const item of items ?? []) {
    if (!map.has(item.id)) map.set(item.id, item);
  }
  return map;
}
