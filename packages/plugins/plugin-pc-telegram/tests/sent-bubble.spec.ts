import { describe, expect, it } from "vitest";
import { bubbleFromSentMessage } from "../src/thread.js";

describe("bubbleFromSentMessage", () => {
  it("keeps the sent id and forces the outgoing direction", () => {
    const bubble = bubbleFromSentMessage(
      { id: 15, out: false, message: "hello", date: 1_700_000_000 },
      "hello",
    );
    expect(bubble).toEqual({
      id: "15",
      direction: "out",
      text: "hello",
      at: new Date(1_700_000_000 * 1000).toISOString(),
    });
  });

  it("uses the submitted text when the short update has no body", () => {
    const bubble = bubbleFromSentMessage({ id: 16n, date: 1_700_000_000 }, "hello");
    expect(bubble?.id).toBe("16");
    expect(bubble?.direction).toBe("out");
    expect(bubble?.text).toBe("hello");
  });

  it("rejects a send result that has no message id", () => {
    expect(bubbleFromSentMessage({ message: "hello" }, "hello")).toBeNull();
    expect(bubbleFromSentMessage({ id: 17, message: "hello" }, "  ")).toBeNull();
  });
});
