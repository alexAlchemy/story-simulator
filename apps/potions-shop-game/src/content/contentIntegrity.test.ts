import { describe, expect, it } from "vitest";
import { content } from "./scenes";
import { dayPlan } from "./dayPlan";
import { scenes } from "./scenes";
import { validateSceneAvailability } from "@aphebis/core";
import { createInitialState } from "./initialState";

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

  it("uses only world effect types for stateful scene effects", () => {
    for (const sceneId of Object.keys(scenes)) {
      const legacyEffects = scenes[sceneId].choices.flatMap((choice) =>
        choice.effects.filter(
          (effect) =>
            ![
              "entityGauge",
              "entityQuantity",
              "setFlag",
              "addScene",
              "removeScene",
              "log"
            ].includes(effect.kind)
        )
      );

      expect(legacyEffects, sceneId).toEqual([]);
    }
  });

  it("validates scene availability references and labels", () => {
    const world = createInitialState().world;
    const issues = Object.values(scenes).flatMap((scene) =>
      validateSceneAvailability(scene, content, world)
    );

    expect(issues).toEqual([]);
  });
});
