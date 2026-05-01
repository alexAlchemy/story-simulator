import { describe, expect, it } from "vitest";
import { content } from "../content/scenes";
import { createInitialState } from "../content/initialState";
import { resolveChoice } from "@aphebis/core";
import {
  getEntityGauge,
  getEntityQuantity,
  getRelationshipDimension
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

    expect(getEntityQuantity(next, "shop", "stock")).toBe(2);
    expect(getEntityGauge(next, "player", "compassion")).toBe(0.2);
    expect(getRelationshipDimension(next, "town->shop", "trust")).toBe(0.1);
    expect(next.flags.stablehand_helped).toBe(true);
    expect(next.flags.stablehand_grateful).toBe(true);
    expect(next.sceneTableau).not.toContain("desperate-stablehand");
    expect(next.resolvedScenes).toContain("desperate-stablehand");
  });
});
