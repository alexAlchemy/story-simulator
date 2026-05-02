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

      for (const [beatId, beat] of Object.entries(scene.beats)) {
        expect(beat.id, `${scene.id}:${beatId}`).toBe(beatId);
        expect(beat.choices.length, `${scene.id}:${beat.id}`).toBeGreaterThan(0);

        for (const choice of beat.choices) {
          const advancesBeat = Boolean(choice.nextBeatId);
          const endsScene = choice.endsScene === true;
          expect(
            advancesBeat !== endsScene,
            `${scene.id}:${choice.id} must either advance to a beat or end the scene`
          ).toBe(true);

          if (choice.nextBeatId) {
            expect(scene.beats[choice.nextBeatId], `${scene.id}:${choice.id}`).toBeTruthy();
          }

          for (const effect of choice.localEffects ?? []) {
            expect(scene.localProperties?.[effect.key], `${scene.id}:${choice.id}`).toBeTruthy();
            if (effect.kind === "changeLocal") {
              expect(
                typeof scene.localProperties?.[effect.key]?.initial,
                `${scene.id}:${choice.id}:${effect.key}`
              ).toBe("number");
            }
          }
        }
      }

      expect(getUnreachableBeatIds(scene)).toEqual([]);
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

function getUnreachableBeatIds(scene: (typeof scenes)[string]): string[] {
  if (!scene.beats || !scene.startBeatId) {
    return [];
  }

  const reachable = new Set<string>();
  const pending = [scene.startBeatId];

  while (pending.length > 0) {
    const beatId = pending.pop();
    if (!beatId || reachable.has(beatId)) {
      continue;
    }

    reachable.add(beatId);

    for (const choice of scene.beats[beatId]?.choices ?? []) {
      if (choice.nextBeatId) {
        pending.push(choice.nextBeatId);
      }
    }
  }

  return Object.keys(scene.beats).filter((beatId) => !reachable.has(beatId));
}
