import { describe, expect, it } from "vitest";
import { content } from "../content/scenes";
import { createInitialState } from "../content/initialState";
import type { GameContent, GameState } from "@aphebis/core";
import { simulateStoryFactMetrics } from "./storyFactMetrics";

describe("simulateStoryFactMetrics", () => {
  it("tracks content story fact coverage without changing engine behavior", () => {
    const report = simulateStoryFactMetrics(content);

    expect(report.factsDefinedInContent).toEqual([
      "left_thanks_for_gift",
      "mistake_handled_gently",
      "mysterious_gift_accepted",
      "stablehand_grateful",
      "stablehand_helped",
      "stablehand_refused"
    ]);
    expect(report.factsNeverObserved).toEqual([]);
    expect(report.factChoiceEffectsNeverObserved).toEqual([]);
    expect(
      report.factMetrics.find((metric) => metric.fact === "stablehand_refused")
    ).toMatchObject({
      setTrueCount: 1,
      setFalseCount: 0
    });
  });

  it("counts unset effects and final absent story as false", () => {
    const report = simulateStoryFactMetrics(fixtureContent, createFixtureState);

    expect(report.factMetrics).toContainEqual({
      fact: "sample_flag",
      setTrueCount: 1,
      setFalseCount: 1,
      finalTrueCount: 1,
      finalFalseCount: 1
    });
  });

  it("reports story fact effects that never fire", () => {
    const report = simulateStoryFactMetrics(unreachableFactContent, createFixtureState);

    expect(report.factsNeverObserved).toEqual(["hidden_flag"]);
    expect(report.factChoiceEffectsNeverObserved).toEqual([
      {
        sceneId: "hidden-scene",
        choiceId: "hidden-choice",
        fact: "hidden_flag",
        value: true
      }
    ]);
  });
});

const fixtureContent: GameContent = {
  scenes: {
    "fact-scene": {
      id: "fact-scene",
      title: "Fact Scene",
      type: "shop",
      description: "A small fixture scene.",
      choices: [
        {
          id: "set-true",
          label: "Set true",
          effects: [{ kind: "setProperty", entityId: "story", property: "sample_flag", value: true }]
        },
        {
          id: "set-false",
          label: "Set false",
          effects: [{ kind: "setProperty", entityId: "story", property: "sample_flag", value: false }]
        }
      ]
    }
  },
  dayPlan: {},
  endDay: 1
};

const unreachableFactContent: GameContent = {
  scenes: {
    "hidden-scene": {
      id: "hidden-scene",
      title: "Hidden Scene",
      type: "shop",
      description: "A fixture scene that never enters the tableau.",
      choices: [
        {
          id: "hidden-choice",
          label: "Set hidden",
          effects: [{ kind: "setProperty", entityId: "story", property: "hidden_flag", value: true }]
        }
      ]
    }
  },
  dayPlan: {},
  endDay: 1
};

function createFixtureState(): GameState {
  const state = createInitialState();

  return {
    ...state,
    world: {
      ...state.world,
      entities: {
        ...state.world.entities,
        shop: {
          ...state.world.entities.shop,
          properties: {
            ...state.world.entities.shop.properties,
            coins: 0,
            stock: 0
          }
        },
        player: {
          ...state.world.entities.player,
          properties: {
            ...state.world.entities.player.properties,
            fatigue: 0,
            compassion: 0,
            prudence: 0,
            ambition: 0
          }
        }
      }
    },
    sceneTableau: ["fact-scene"],
    resolvedScenes: [],
    log: [],
    ended: false
  };
}
