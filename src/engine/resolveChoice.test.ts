import { describe, expect, it } from "vitest";
import { content } from "../content/scenes";
import { createInitialState } from "../content/initialState";
import { resolveChoice } from "./resolveChoice";
import {
  getEntityGauge,
  getEntityQuantity,
  getRelationshipDimension
} from "./worldAccess";

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
    expect(next.world.relationships["town->shop"].tokens).toContainEqual({
      id: "stablehand-helped",
      kind: "favour",
      label: "Helped the stablehand's sister",
      description: "Word may spread that the shop helps desperate families.",
      sourceSceneId: "desperate-stablehand"
    });
    expect(next.flags.stablehand_grateful).toBe(true);
    expect(next.sceneTableau).not.toContain("desperate-stablehand");
    expect(next.resolvedScenes).toContain("desperate-stablehand");
  });
});
