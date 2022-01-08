type Key = string | number;

// TODO: describe a union of objects and their discriminator key/value along with other possible values
type UnionLike = { [k: Key]: Key } & { [f: Key]: any };

interface DefaultCaseHandler {
  _?: (v: unknown) => unknown;
}

export type CaseHandlers<Tag extends Key, Union extends UnionLike> = {
  [P in Union as P[Tag]]: (v: P) => unknown;
} & DefaultCaseHandler;

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
export const createMatcher =
  <Union extends UnionLike>() =>
  <Tag extends Extract<keyof Union, Key>>(tag: Tag) =>
  <Cases extends CaseHandlers<Tag, Union>>(cases: Cases) =>
  <Value extends Union>(v: Value): ReturnType<Cases[Value[Tag]]> => {
    const handler = cases[v[tag]];
    return handler ? handler(v) : cases._?.(v);
  };
