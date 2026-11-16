import { describe, expect, it } from "vitest";
import { indexById } from "./index-by-id";

describe("indexById", () => {
  it("indexes items once and ignores a missing list", () => {
    expect(indexById([{ id: "a", name: "Alpha" }, { id: "b", name: "Beta" }, { id: "a", name: "Later" }]).get("a")).toEqual({ id: "a", name: "Alpha" });
    expect(indexById(null).size).toBe(0);
    expect(indexById(undefined).size).toBe(0);
  });
});
