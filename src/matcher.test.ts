import { createMatcher } from "./matcher";

describe("check matcher calls correct handlers", () => {
  it("calls handlers for string/numeric keys: 400, 500 and _", async () => {
    const match = createMatcher<ServerResponse>()("status");
    type ServerResponse =
      | { status: 500; message: string }
      | { status: 400; error: string };

    const match500 = match({
      500: ({ message }) => message,
      400: ({ error }) => error,
      _: () => "no match",
    })({ status: 500, message: "woops" });

    const match400 = match({
      500: ({ message }) => message,
      400: ({ error }) => error,
      _: () => "no match",
    })({ status: 400, error: "bad req" });

    const match_ = match({
      500: ({ message }) => message,
      400: ({ error }) => error,
      _: () => "no match",
    })({ type: 500 } as any);

    const match_none = match({
      500: ({ message }) => message,
      400: ({ error }) => error,
    })({} as any);

    expect(match500).toBe("woops");
    expect(match400).toBe("bad req");
    expect(match_).toBe("no match");
    expect(match_none).toBe(undefined);
  });
});
