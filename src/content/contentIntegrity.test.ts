import { describe, expect, it } from "vitest";
import { dayPlan } from "./dayPlan";
import { scenes } from "./scenes";

describe("content integrity", () => {
  it("references only existing day-plan scenes", () => {
    const missing = Object.values(dayPlan)
      .flat()
      .filter((sceneId) => !scenes[sceneId]);

    expect(missing).toEqual([]);
  });

  it("references only existing effect-added and transformed scenes", () => {
    const referenced = new Set<string>();

    for (const scene of Object.values(scenes)) {
      if (scene.clock?.transformsInto) {
        referenced.add(scene.clock.transformsInto);
      }

      for (const choice of scene.choices) {
        for (const effect of choice.effects) {
          if (effect.kind === "addScene" || effect.kind === "removeScene") {
            referenced.add(effect.sceneId);
          }
        }
      }
    }

    const missing = [...referenced].filter((sceneId) => !scenes[sceneId]);
    expect(missing).toEqual([]);
  });

  it("gives every scene at least two choices with effects", () => {
    for (const scene of Object.values(scenes)) {
      expect(scene.choices.length, scene.id).toBeGreaterThanOrEqual(2);
      for (const choice of scene.choices) {
        expect(choice.effects.length, `${scene.id}:${choice.id}`).toBeGreaterThan(0);
      }
    }
  });
});
