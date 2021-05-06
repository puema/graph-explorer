export function getDescendants(
  id: string,
  childNodesMap: Map<string, string[]>
) {
  const descendants = new Set<string>();
  const stack = [...(childNodesMap.get(id) || [])];

  while (stack.length) {
    const current = stack.pop()!;
    descendants.add(current);
    const children = childNodesMap.get(current);
    if (children) stack.push(...children);
  }

  return descendants;
}
