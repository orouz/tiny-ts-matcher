import { createMatcher } from "./matcher";

describe("match", () => {
  it("matches all cases correctly including default", async () => {
    const match = createMatcher("status");
    type ServerResponse =
      | { status: 500; message: string }
      | { status: 400; error: string };

    const match500 = match<ServerResponse>()({
      500: ({ message }) => `Server Error - ${message}`,
      400: ({ error }) => error,
      _: () => "no match",
    })({ status: 500, message: "woops" });

    const match400 = match<ServerResponse>()({
      500: ({ message }) => `Server Error - ${message}`,
      400: ({ error }) => error,
      _: () => "no match",
    })({ status: 400, error: "bad req" });

    const match_ = match<ServerResponse>()({
      500: ({ message }) => `Server Error - ${message}`,
      400: ({ error }) => error,
      _: () => "no match",
    })({} as any);

    expect(match500).toBe(`Server Error - woops`);
    expect(match400).toBe(`bad req`);
    expect(match_).toBe(`no match`);
  });
});
