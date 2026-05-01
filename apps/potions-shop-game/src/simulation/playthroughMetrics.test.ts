import { describe, expect, it } from "vitest";
import { content } from "../content/scenes";
import { simulatePlaythroughMetrics } from "./playthroughMetrics";

describe("simulatePlaythroughMetrics", () => {
  it("averages resources, standing, and values by turn", () => {
    const report = simulatePlaythroughMetrics(content, {
      runs: 25,
      rng: seededRng(1234)
    });

    expect(report.runCount).toBe(25);
    expect(report.runs).toHaveLength(25);
    expect(report.averageByTurn[0]).toMatchObject({
      turn: 0,
      runCount: 25,
      averageDay: 1,
      resources: {
        coins: 18,
        stock: 3,
        fatigue: 0
      },
      standing: {
        apprenticeTrust: 0,
        shopStanding: 0
      },
      values: {
        compassion: 0,
        prudence: 0,
        ambition: 0
      }
    });
    expect(report.averageByTurn.at(-1)?.runCount).toBeGreaterThan(0);
    expect(report.finalAverage.resources.coins).toBeGreaterThanOrEqual(0);
  });

  it("stores per-run snapshots for later inspection", () => {
    const report = simulatePlaythroughMetrics(content, {
      runs: 1,
      rng: seededRng(42)
    });
    const run = report.runs[0];

    expect(run.snapshots[0].turn).toBe(0);
    expect(run.snapshots.at(-1)?.turn).toBe(run.snapshots.length - 1);
    expect(run.finalState.day).toBe(5);
    expect(run.finalState.ended).toBe(true);
  });
});

function seededRng(seed: number): () => number {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}
