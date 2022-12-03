/**
 * @example
 * const [state, setState] = useState({key1: 'value1', key2: 'value2', ...rest});
 * setState(prevState => keepRestPrevState(prevState, ['key1'], {key1: 'changed-value1'}));
 */
export default function keepRestPrevState<V extends Object>(prevState: V, changeKeys: (keyof V)[], value: Partial<V>): V {
  return Object.keys(prevState).reduce((a, b) => {
    if (changeKeys.includes(b as keyof V)) {
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      a[b] = value[b];

    } else {
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      a[b] = prevState[b];
    }

    return a;
  }, {} as V);
}
