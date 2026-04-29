import { describe, expect, it } from "vitest";
import { content } from "../content/scenes";
import { createInitialState } from "../domain/initialState";
import { advanceDay } from "./advanceDay";
import { buildEnding } from "./buildEnding";

describe("advanceDay", () => {
  it("adds planned scenes for the next day", () => {
    const next = advanceDay(createInitialState(), content);

    expect(next.day).toBe(2);
    expect(next.sceneTableau).toContain("counting-coins");
    expect(next.sceneTableau).toContain("forage-bad-weather");
  });

  it("applies scene transformations", () => {
    const state = {
      ...createInitialState(),
      day: 3,
      sceneTableau: ["gift-at-door"]
    };

    const next = advanceDay(state, content);

    expect(next.day).toBe(4);
    expect(next.sceneTableau).toContain("gift-giver-revealed");
    expect(next.sceneTableau).not.toContain("gift-at-door");
  });

  it("can reach a Day 5 ending", () => {
    let state = createInitialState();
    state = advanceDay(state, content);
    state = advanceDay(state, content);
    state = advanceDay(state, content);
    state = advanceDay(state, content);
    state = advanceDay(state, content);

    expect(state.day).toBe(5);
    expect(state.ended).toBe(true);
    expect(buildEnding(state, content).title).toBeTruthy();
  });
});
