import { describe, expect, it } from "vitest";
import { content } from "../content/scenes";
import { createInitialState } from "../content/initialState";
import type { GameContent, GameState } from "@aphebis/core";
import { simulateFlagMetrics } from "./flagMetrics";

describe("simulateFlagMetrics", () => {
  it("tracks content flag set coverage without changing engine behavior", () => {
    const report = simulateFlagMetrics(content);

    expect(report.flagsDefinedInContent).toEqual([
      "left_thanks_for_gift",
      "mistake_handled_gently",
      "mysterious_gift_accepted",
      "stablehand_grateful",
      "stablehand_helped",
      "stablehand_refused"
    ]);
    expect(report.flagsNeverObserved).toEqual([]);
    expect(report.flagChoiceEffectsNeverObserved).toEqual([]);
    expect(
      report.flagMetrics.find((metric) => metric.flag === "stablehand_refused")
    ).toMatchObject({
      setTrueCount: 1,
      setFalseCount: 0
    });
  });

  it("counts unset effects and final absent flags as false", () => {
    const report = simulateFlagMetrics(fixtureContent, createFixtureState);

    expect(report.flagMetrics).toContainEqual({
      flag: "sample_flag",
      setTrueCount: 1,
      setFalseCount: 1,
      finalTrueCount: 1,
      finalFalseCount: 1
    });
  });

  it("reports flag effects that never fire", () => {
    const report = simulateFlagMetrics(unreachableFlagContent, createFixtureState);

    expect(report.flagsNeverObserved).toEqual(["hidden_flag"]);
    expect(report.flagChoiceEffectsNeverObserved).toEqual([
      {
        sceneId: "hidden-scene",
        choiceId: "hidden-choice",
        flag: "hidden_flag",
        value: true
      }
    ]);
  });
});

const fixtureContent: GameContent = {
  scenes: {
    "flag-scene": {
      id: "flag-scene",
      title: "Flag Scene",
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

const unreachableFlagContent: GameContent = {
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
    flags: {},
    sceneTableau: ["flag-scene"],
    resolvedScenes: [],
    log: [],
    ended: false
  };
}
