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
  // ^^ TagKey is the discriminator of our discriminated union
  return <TaggedUnion extends { [E in TagKey]: string | number }>() => {
    // ^^ TaggedUnion is our discriminated union
    return <
      Cases extends {
        // ^^ Cases is our handlers object (like switch cases)
        [P in TaggedUnion[TagKey]]: (
          // ^^ verify all keys are specified in Cases (although it will take more)
          v: TaggedUnion & { [E in TagKey]: P }
          // ^^ use the correct union type as the handler argument type by narrowing down TaggedUnion
        ) => any;
        // ^^ we can return anything from each case, it will be inferred later
      } & { _?: (v: unknown) => any }
      // ^^ use "_" as the default case handler
    >(
      cases: Cases
    ) => <Value extends TaggedUnion>(
      // ^^ the value to match against
      v: Value
    ): ReturnType<Cases[Value[TagKey]]> =>
      // ^^ Get the value from Cases given the TagKey of Value
      cases[v[key]]?.(v) ?? cases["_"]?.(v);
    // ^^ return the value from a case handler or the default handler, undefined if none return a value
  };
}
