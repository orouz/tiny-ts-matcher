/**
 * Match a value to a handler based on a discriminated union type
 * @example
 * const match = createMatcher('status')
 * type ServerResponse = {status: 500, msg: string } | {status: 400, error: string}
 * match<ServerResponse>({
 *  500: ({msg}) => { // use msg }
 *  400: ({error}) => { // use error }
 *  _: () => 'default'
 * })
 */
export function createMatcher<TagKey extends string>(key: TagKey) {
  return <TaggedUnion extends { [E in TagKey]: string | number }>() => {
    return <
      Cases extends {
        [P in TaggedUnion[TagKey]]: (
          v: TaggedUnion & { [E in TagKey]: P }
        ) => any;
      } & { _?: (v: unknown) => any }
    >(
      cases: Cases
    ) => <Value extends TaggedUnion>(
      v: Value
    ): ReturnType<Cases[Value[TagKey]]> =>
      cases[v[key]]?.(v) ?? cases["_"]?.(v);
  };
}
