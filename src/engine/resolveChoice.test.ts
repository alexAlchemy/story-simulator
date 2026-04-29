import { describe, expect, it } from "vitest";
import { content } from "../content/scenes";
import { createInitialState } from "../domain/initialState";
import { resolveChoice } from "./resolveChoice";

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

    expect(next.resources.stock).toBe(2);
    expect(next.values.compassion).toBe(2);
    expect(next.relationships.townTrust).toBe(1);
    expect(next.flags.stablehand_grateful).toBe(true);
    expect(next.sceneTableau).not.toContain("desperate-stablehand");
    expect(next.sceneTableau).toContain("temple-healer-visits");
    expect(next.resolvedScenes).toContain("desperate-stablehand");
  });
});
