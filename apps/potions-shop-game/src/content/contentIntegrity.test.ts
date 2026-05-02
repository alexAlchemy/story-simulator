import { describe, expect, it } from "vitest";
import { content } from "./scenes";
import { dayPlan } from "./dayPlan";
import { scenes } from "./scenes";
import { getAllSceneChoices, validateSceneAvailability } from "@aphebis/core";
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
      for (const choice of getAllSceneChoices(scene)) {
        for (const effect of choice.effects ?? []) {
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
      const choices = getAllSceneChoices(scene);
      expect(choices.length, scene.id).toBeGreaterThanOrEqual(2);
      for (const choice of choices) {
        const hasSceneEffect = (choice.effects?.length ?? 0) > 0;
        const hasLocalEffect = "localEffects" in choice && (choice.localEffects?.length ?? 0) > 0;
        const movesBeat = "nextBeatId" in choice && Boolean(choice.nextBeatId);
        expect(
          hasSceneEffect || hasLocalEffect || movesBeat,
          `${scene.id}:${choice.id}`
        ).toBe(true);
      }
    }
  });

  it("uses only world effect types for stateful scene effects", () => {
    for (const sceneId of Object.keys(scenes)) {
      const legacyEffects = getAllSceneChoices(scenes[sceneId]).flatMap((choice) =>
        (choice.effects ?? []).filter(
          (effect) =>
            ![
              "changeProperty",
              "setProperty",
              "addScene",
              "removeScene",
              "log"
            ].includes(effect.kind)
        )
      );

      expect(legacyEffects, sceneId).toEqual([]);
    }
  });

  it("validates beat scene structure", () => {
    for (const scene of Object.values(scenes)) {
      if (!scene.beats) {
        continue;
      }

      expect(scene.startBeatId, scene.id).toBeTruthy();
      expect(scene.beats[scene.startBeatId ?? ""], scene.id).toBeTruthy();

      for (const beat of Object.values(scene.beats)) {
        expect(beat.choices.length, `${scene.id}:${beat.id}`).toBeGreaterThan(0);

        for (const choice of beat.choices) {
          if (choice.nextBeatId) {
            expect(scene.beats[choice.nextBeatId], `${scene.id}:${choice.id}`).toBeTruthy();
          }

          for (const effect of choice.localEffects ?? []) {
            expect(scene.localProperties?.[effect.key], `${scene.id}:${choice.id}`).toBeTruthy();
          }
        }
      }
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
