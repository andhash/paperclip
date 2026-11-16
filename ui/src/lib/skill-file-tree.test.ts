import { describe, expect, it } from "vitest";
import type { CompanySkillFileInventoryEntry } from "@paperclipai/shared";
import { buildSkillFileTree } from "./skill-file-tree";

function entry(path: string, kind: CompanySkillFileInventoryEntry["kind"] = "markdown"): CompanySkillFileInventoryEntry {
  return { path, kind };
}

describe("buildSkillFileTree", () => {
  it("shares directories and keeps the existing sort", () => {
    const tree = buildSkillFileTree([
      entry("guides/setup.md"),
      entry("SKILL.md"),
      entry("guides/SKILL.md"),
      entry("guides/images/diagram.png", "asset"),
      entry("notes.txt"),
    ]);

    expect(tree.map((node) => node.name)).toEqual(["guides", "SKILL.md", "notes.txt"]);
    const guides = tree[0]!;
    expect(guides.kind).toBe("dir");
    expect(guides.children.map((node) => [node.name, node.kind, node.fileKind ?? null])).toEqual([
      ["images", "dir", null],
      ["SKILL.md", "file", "markdown"],
      ["setup.md", "file", "markdown"],
    ]);
    expect(guides.children[0]!.children).toEqual([
      expect.objectContaining({ name: "diagram.png", kind: "file", path: "guides/images/diagram.png", fileKind: "asset" }),
    ]);
  });

  it("does not rewrite a name that was already inserted", () => {
    const tree = buildSkillFileTree([
      entry("pkg/SKILL.md"),
      entry("pkg"),
    ]);

    expect(tree).toEqual([
      expect.objectContaining({
        name: "pkg",
        kind: "dir",
        path: "pkg",
        children: [expect.objectContaining({ name: "SKILL.md", kind: "file", path: "pkg/SKILL.md" })],
      }),
    ]);
  });
});
