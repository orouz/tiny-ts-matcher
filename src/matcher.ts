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
export function createMatcher<Tag extends string>(key: Tag) {
  return <Union extends { [E in Tag]: any }>() => {
    return <
      Cases extends {
        [P in Union[Tag]]: (v: Union & { [E in Tag]: P }) => unknown;
      } & { _?: (v: unknown) => unknown }
    >(
      cases: Cases
    ) => <Value extends Union>(v: Value): ReturnType<Cases[Value[Tag]]> => {
      const handler = cases[v[key]];
      return handler ? handler(v) : cases._?.(v);
    };
  };
}
