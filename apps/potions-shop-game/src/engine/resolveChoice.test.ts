import { describe, expect, it } from "vitest";
import { content } from "../content/scenes";
import { createInitialState } from "../content/initialState";
import { resolveChoice } from "@aphebis/core";
import {
  getBooleanProperty,
  getNumericProperty
} from "@aphebis/core";

describe("resolveChoice", () => {
  it("rejects unknown scene ids", () => {
    expect(() =>
      resolveChoice(createInitialState(), "missing-scene", "choice", content)
    ).toThrow("Unknown scene id");
  });

  it("rejects unknown choice ids", () => {
    expect(() =>
      resolveChoice(
        createInitialState(),
        "desperate-stablehand",
        "missing-choice",
        content
      )
    ).toThrow("Unknown choice id");
  });

  it("applies effects, removes the scene, and marks it resolved", () => {
    const next = resolveChoice(
      createInitialState(),
      "desperate-stablehand",
      "free-draught",
      content
    );

    expect(getNumericProperty(next, "shop", "stock")).toBe(2);
    expect(getNumericProperty(next, "player", "compassion")).toBe(0.2);
    expect(getNumericProperty(next, "shop", "shopStanding")).toBe(0.1);
    expect(getBooleanProperty(next, "story", "stablehand_helped")).toBe(true);
    expect(getBooleanProperty(next, "story", "stablehand_grateful")).toBe(true);
    expect(next.sceneTableau).not.toContain("desperate-stablehand");
    expect(next.resolvedScenes).toContain("desperate-stablehand");
  });
});
