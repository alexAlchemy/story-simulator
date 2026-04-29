import { describe, expect, it } from "vitest";
import { createInitialState } from "../domain/initialState";
import { content } from "./scenes";
import { auditSceneChoiceEffects } from "./effectAudit";

declare const process: {
  env: Record<string, string | undefined>;
};

describe("scene choice effect audit", () => {
  it("summarizes numeric state changes across all scene choices", () => {
    const audit = auditSceneChoiceEffects(content, createInitialState());

    expect(audit).toMatchObject({
      totalScenes: 14,
      totalChoices: 40,
      totalAuditedEffects: 131
    });

    expect(audit.targets.find((target) => target.label === "player.compassion")).toMatchObject({
      increments: 7,
      decrements: 3,
      totalDelta: 0.6,
      totalAbsoluteDelta: 1.2,
      averageDelta: 0.06,
      averageAbsoluteDelta: 0.12
    });
    expect(audit.targets.find((target) => target.label === "player.ambition")).toMatchObject({
      increments: 7,
      decrements: 3,
      totalDelta: 0.5,
      positiveDeltaTotal: 0.8,
      negativeDeltaTotal: -0.3,
      potentialPositive75: 0.6,
      potentialMaximum: 0.8
    });
    expect(audit.targets.find((target) => target.label === "town->shop.trust")).toMatchObject({
      increments: 10,
      decrements: 2,
      initialValue: 0,
      totalDelta: 0.8,
      totalAbsoluteDelta: 1.2,
      positiveDeltaTotal: 1,
      negativeDeltaTotal: -0.2,
      potentialPositive50: 0.5,
      potentialPositive75: 0.75,
      potentialMaximum: 1,
      averageDelta: 0.067,
      averageAbsoluteDelta: 0.1
    });
    expect(audit.targets.find((target) => target.label === "apprentice.confidence")).toMatchObject({
      increments: 3,
      decrements: 2,
      totalChanges: 5,
      totalDelta: 0.3
    });
    expect(audit.targets.find((target) => target.label === "town->shop.goodwill")).toMatchObject({
      increments: 7,
      decrements: 3,
      totalChanges: 10,
      totalDelta: 0.5
    });
    expect(audit.targets.find((target) => target.label === "town.gossipHeat")).toMatchObject({
      increments: 5,
      decrements: 2,
      totalChanges: 7,
      totalDelta: 0.5
    });
    expect(audit.targets.find((target) => target.label === "apprentice->player.affection")).toMatchObject({
      increments: 8,
      decrements: 4,
      totalChanges: 12,
      totalDelta: 1.1
    });
    expect(audit.targets.find((target) => target.label === "apprentice->player.fear")).toMatchObject({
      increments: 2,
      decrements: 2,
      totalChanges: 4,
      totalDelta: 0.1
    });
  });

  it("can print a balance table when SCENE_EFFECT_AUDIT=1", () => {
    const audit = auditSceneChoiceEffects(content, createInitialState());

    if (process.env.SCENE_EFFECT_AUDIT === "1") {
      console.table(
        audit.targets.map((target) => ({
          target: target.label,
          kind: target.kind,
          changes: target.totalChanges,
          increments: target.increments,
          decrements: target.decrements,
          positiveTotal: target.positiveDeltaTotal,
          negativeTotal: target.negativeDeltaTotal,
          positive50: target.potentialPositive50,
          positive75: target.potentialPositive75,
          naiveMax: target.potentialMaximum,
          negative75: target.potentialNegative75,
          naiveMin: target.potentialMinimum,
          totalDelta: target.totalDelta,
          absDelta: target.totalAbsoluteDelta,
          avgDelta: target.averageDelta,
          avgAbsDelta: target.averageAbsoluteDelta,
          scenes: target.sceneIds.length
        }))
      );
    }

    expect(audit.targets.length).toBeGreaterThan(0);
  });
});
