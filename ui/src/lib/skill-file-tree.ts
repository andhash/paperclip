import type { CompanySkillFileInventoryEntry } from "@paperclipai/shared";

export interface SkillFileTreeNode {
  name: string;
  path: string | null;
  kind: "dir" | "file";
  fileKind?: CompanySkillFileInventoryEntry["kind"];
  children: SkillFileTreeNode[];
}

/**
 * Build the skill file tree in one walk. Each directory keeps a name index so
 * inserting the next path does not scan that directory's children again.
 * The resulting nodes, order, and reuse of an existing name match the previous
 * scan: a name that already exists is not rewritten.
 */
export function buildSkillFileTree(entries: readonly CompanySkillFileInventoryEntry[]): SkillFileTreeNode[] {
  const root: SkillFileTreeNode = { name: "", path: null, kind: "dir", children: [] };
  const childrenByNode = new Map<SkillFileTreeNode, Map<string, SkillFileTreeNode>>();

  const childrenOf = (node: SkillFileTreeNode) => {
    let index = childrenByNode.get(node);
    if (!index) {
      index = new Map();
      childrenByNode.set(node, index);
    }
    return index;
  };

  for (const entry of entries) {
    const segments = entry.path.split("/").filter(Boolean);
    let current = root;
    let currentPath = "";
    for (const [index, segment] of segments.entries()) {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      const isLeaf = index === segments.length - 1;
      const siblings = childrenOf(current);
      let next = siblings.get(segment);
      if (!next) {
        next = {
          name: segment,
          path: isLeaf ? entry.path : currentPath,
          kind: isLeaf ? "file" : "dir",
          fileKind: isLeaf ? entry.kind : undefined,
          children: [],
        };
        current.children.push(next);
        siblings.set(segment, next);
      }
      current = next;
    }
  }

  const sortNode = (node: SkillFileTreeNode) => {
    node.children.sort((left, right) => {
      if (left.kind !== right.kind) return left.kind === "dir" ? -1 : 1;
      if (left.name === "SKILL.md") return -1;
      if (right.name === "SKILL.md") return 1;
      return left.name.localeCompare(right.name);
    });
    for (const child of node.children) sortNode(child);
  };

  sortNode(root);
  return root.children;
}
