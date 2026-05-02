import { describe, expect, it } from "vitest";
import { content } from "../content/scenes";
import { createInitialState } from "../content/initialState";
import { resolveChoice, resolveChoiceWithOutcome } from "@aphebis/core";
import {
  getBooleanProperty,
  getSceneChoices,
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

  it("advances beat scenes without resolving them until a commitment choice", () => {
    const next = resolveChoice(
      createInitialState(),
      "desperate-stablehand",
      "ask-what-happened",
      content
    );

    expect(next.activeScene?.sceneId).toBe("desperate-stablehand");
    expect(next.activeScene?.currentBeatId).toBe("story-shifts");
    expect(next.activeScene?.localState.trust).toBe(1);
    expect(next.sceneTableau).toContain("desperate-stablehand");
    expect(next.resolvedScenes).not.toContain("desperate-stablehand");
  });

  it("applies effects, removes the scene, and marks it resolved on an ending beat", () => {
    const started = resolveChoice(
      createInitialState(),
      "desperate-stablehand",
      "ask-what-happened",
      content
    );
    const complicated = resolveChoice(
      started,
      "desperate-stablehand",
      "need-only-fact",
      content
    );
    const next = resolveChoice(
      complicated,
      "desperate-stablehand",
      "free-draught",
      content
    );

    expect(getNumericProperty(next, "shop", "stock")).toBe(2);
    expect(getNumericProperty(next, "player", "compassion")).toBe(0.2);
    expect(getNumericProperty(next, "shop", "goodwill")).toBe(0.1);
    expect(getBooleanProperty(next, "story", "stablehand_helped")).toBe(true);
    expect(getBooleanProperty(next, "story", "stablehand_grateful")).toBe(true);
    expect(next.sceneTableau).not.toContain("desperate-stablehand");
    expect(next.resolvedScenes).toContain("desperate-stablehand");
  });

  it("returns authored aftermath built from traced terminal beat effects", () => {
    const started = resolveChoice(
      createInitialState(),
      "desperate-stablehand",
      "ask-what-happened",
      content
    );
    const complicated = resolveChoice(
      started,
      "desperate-stablehand",
      "need-only-fact",
      content
    );
    const outcome = resolveChoiceWithOutcome(
      complicated,
      "desperate-stablehand",
      "free-draught",
      content
    );

    expect(outcome.aftermath).toMatchObject({
      title: "Scene Aftermath",
      sceneId: "desperate-stablehand",
      sceneTitle: "The Desperate Stablehand",
      futureEchoText: [
        "Word may spread that your shop helps people who cannot pay.",
        "Your apprentice will remember that you gave before asking for coin."
      ]
    });
    expect(outcome.aftermath?.narration).toContain("you gave him the fever draught");
    expect(outcome.aftermath?.changes.map((change) => change.label)).toEqual([
      "Stock",
      "Compassion",
      "Goodwill",
      "Trust"
    ]);
    expect(outcome.aftermath?.changes[0]).toMatchObject({
      entityId: "shop",
      property: "stock",
      before: "3",
      after: "2",
      spotlighted: true
    });
  });

  it("uses local state to unlock later beat choices", () => {
    const started = resolveChoice(
      createInitialState(),
      "desperate-stablehand",
      "ask-what-happened",
      content
    );
    const complicated = resolveChoice(
      started,
      "desperate-stablehand",
      "need-only-fact",
      content
    );
    const scene = content.scenes["desperate-stablehand"];

    expect(
      getSceneChoices(scene, complicated.activeScene).map((choice) => choice.id)
    ).toContain("written-guarantee");
  });

  it("keeps conditional beat choices hidden when local state does not satisfy them", () => {
    const started = resolveChoice(
      createInitialState(),
      "desperate-stablehand",
      "call-apprentice",
      content
    );
    const complicated = resolveChoice(
      started,
      "desperate-stablehand",
      "ask-apprentice-stock",
      content
    );
    const scene = content.scenes["desperate-stablehand"];

    expect(
      getSceneChoices(scene, complicated.activeScene).map((choice) => choice.id)
    ).not.toContain("written-guarantee");
  });

  it("rejects resolving another scene while a beat scene is active", () => {
    const started = resolveChoice(
      createInitialState(),
      "desperate-stablehand",
      "ask-what-happened",
      content
    );

    expect(() =>
      resolveChoice(started, "apprentice-hiding-mistake", "ask-gently", content)
    ).toThrow('Scene "desperate-stablehand" is already active');
  });
});
