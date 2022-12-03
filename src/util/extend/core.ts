/**
 * @example (1234.1234) => "1,234.1234"
 */
export function numberWithComma(value: number | string): string {
  const _value = typeof value === 'string' ? value : value.toString();
  const parts = _value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export type PkType = string | number;

export function removeDuplicatedObject<I extends Object, P extends PkType>(items: I[], pkExtractor: (item: I) => P): I[] {
  const record = items.reduce((a, b) => {
    const pk = pkExtractor(b);
    // eslint-disable-next-line no-param-reassign
    a[pk] = b;
    return a;
  }, {} as Record<P, I>);

  return Object.entries<I>(record).map(([, item]) => item);
}

export function count(text: string, target: string) {
  const regex = new RegExp(target, 'g');
  return (text.match(regex) || []).length;
}

export function removeDuplicatedItems<T extends string | number>(array: T[]): T[] {
  return Array.from(new Set(array));
}
