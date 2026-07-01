import type { Blocker } from "../domain/types";

export function calculateRiskScore(
  blockers: Blocker[],
  confidence: number,
): number {
  const blockerRisk = blockers.reduce(
    (score, blocker) =>
      score + (blocker.blocksProgress ? 28 : blocker.severity === "error" ? 18 : 10),
    0,
  );
  const confidenceRisk = Math.round((1 - confidence) * 30);
  return Math.min(100, blockerRisk + confidenceRisk);
}
