import type { Blocker, RouteDecision } from "../domain/types";

export function routeDecision(blockers: Blocker[]): RouteDecision {
  if (blockers.some(({ blocksProgress }) => blocksProgress)) return "blocked";
  if (blockers.length > 0) return "needs_review";
  return "completed";
}
