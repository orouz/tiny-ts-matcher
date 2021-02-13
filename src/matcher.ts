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
      // ^^ the value to match against must be one of our union type
      v: Value
    ): TaggedUnion[TagKey] extends Value[TagKey]
      ? unknown extends Cases["_"]
        ? undefined
        : ReturnType<Cases["_"]>
      : ReturnType<Cases[Value[TagKey]]> =>
      // ^^ the return type should be what our handler returns if it's called
      // otherwise, fall back to default handler or undefined if there isn't one
      // we can tell which return type it's going to be by checking the given value
      // a value with a correct tag key should hit a case handler, so we check if the entire union extends the key
      // which it won't, as the key is missing members (rest of the union) so it will get to the 'else' branch to get the return type of the case handler
      // only 'any' or 'unknown' will get to the first branch, as both are top-types, which can always be extended, and can also be passed as the value type
      cases[v[key]]?.(v) ?? cases["_"]?.(v);
    // ^^ return the value from a case handler or the default handler, undefined if none return a value
  };
}
