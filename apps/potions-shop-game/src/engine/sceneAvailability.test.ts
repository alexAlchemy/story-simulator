import { describe, expect, it } from "vitest";
import { content } from "../content/scenes";
import { createInitialState } from "../content/initialState";
import type { GameContent, Scene } from "@aphebis/core";
import { advanceDay } from "@aphebis/core";
import { resolveChoice } from "@aphebis/core";
import {
  canSeeScene,
  validateSceneAvailability
} from "@aphebis/core";
import { getVisibleScenes } from "@aphebis/core";
import { getNumericProperty } from "@aphebis/core";
import { propertyDefinitions } from "@aphebis/system-cosy-shop";

describe("sceneAvailability", () => {
  it("reveals the apprentice's first cure after emotional investment", () => {
    let state = createInitialState();

    expect(getVisibleScenes(state, content).map((scene) => scene.id)).not.toContain(
      "apprentice-first-cure"
    );

    state = resolveChoice(state, "after-hours-tea", "sit-beside-them", content);
    state = resolveChoice(state, "after-hours-tea", "listen-closely", content);
    state = resolveChoice(state, "apprentice-hiding-mistake", "call-them-over", content);
    state = resolveChoice(state, "apprentice-hiding-mistake", "ask-gently", content);
    state = advanceDay(state, content);
    state = advanceDay(state, content);

    const visibleSceneIds = getVisibleScenes(state, content).map((scene) => scene.id);
    expect(visibleSceneIds).toContain("apprentice-first-cure");

    state = resolveChoice(state, "apprentice-first-cure", "watch-apprentice", content);
    state = resolveChoice(state, "apprentice-first-cure", "praise-in-public", content);
    expect(getNumericProperty(state, "apprentice", "affection")).toBeGreaterThan(0.7);
  });

  it("reveals the forage scene when stock pressure becomes high enough", () => {
    let state = createInitialState();

    state = helpStablehand(state);
    state = advanceDay(state, content);

    expect(getVisibleScenes(state, content).map((scene) => scene.id)).toContain(
      "forage-bad-weather"
    );
  });

  it("keeps the rival scene hidden until ambition or gossip cross the threshold", () => {
    const base = createInitialState();
    const state = {
      ...base,
      day: 4,
      world: {
        ...base.world,
        entities: {
          ...base.world.entities,
          player: {
            ...base.world.entities.player,
            properties: {
              ...base.world.entities.player.properties,
              ambition: 0.3
            }
          },
          town: {
            ...base.world.entities.town,
            properties: {
              ...base.world.entities.town.properties,
              gossipHeat: 0.5
            }
          }
        }
      },
      sceneTableau: ["rivals-cheap-cure"],
      resolvedScenes: [],
      log: [],
      ended: false
    };

    expect(canSeeScene(content.scenes["rivals-cheap-cure"], state, content)).toBe(true);
    expect(getVisibleScenes(state, content).map((scene) => scene.id)).toContain(
      "rivals-cheap-cure"
    );
  });

  it("requires the stablehand-helped story fact before debt-called-in can appear", () => {
    let state = createInitialState();

    state = helpStablehand(state);
    state = advanceDay(state, content);
    state = advanceDay(state, content);
    state = advanceDay(state, content);

    expect(getVisibleScenes(state, content).map((scene) => scene.id)).toContain(
      "debt-called-in"
    );
  });

  it("rejects attempts to resolve a scene that is still in the tableau but no longer eligible", () => {
    const base = createInitialState();
    const state = {
      ...base,
      day: 3,
      sceneTableau: ["apprentice-first-cure"]
    };

    expect(() =>
      resolveChoice(state, "apprentice-first-cure", "praise-in-public", content)
    ).toThrow("Scene is not currently available");
  });

  it("reports malformed availability references", () => {
    const fixtureContent: GameContent = {
      scenes: {
        broken: {
          id: "broken",
          title: "Broken",
          type: "shop",
          description: "A test scene.",
          availability: {
            all: [
              { kind: "resolvedScene", sceneId: "missing-scene" },
              {
                kind: "property",
                entityId: "player",
                property: "compassion",
                minLabel: "NotARealLabel"
              }
            ]
          },
          choices: [{ id: "ok", label: "Ok", effects: [{ kind: "log", text: "test" }] }]
        }
      },
      dayPlan: {},
      endDay: 1,
      semantics: {
        propertyDefinitions
      }
    };

    const issues = validateSceneAvailability(
      fixtureContent.scenes.broken as Scene,
      fixtureContent
    );

    expect(issues).toEqual([
      'broken: availability references unknown scene "missing-scene"',
      'broken: property availability references unknown label "NotARealLabel"'
    ]);
  });
});

function helpStablehand(state: ReturnType<typeof createInitialState>) {
  state = resolveChoice(state, "desperate-stablehand", "ask-what-happened", content);
  state = resolveChoice(state, "desperate-stablehand", "need-only-fact", content);
  return resolveChoice(state, "desperate-stablehand", "free-draught", content);
}
