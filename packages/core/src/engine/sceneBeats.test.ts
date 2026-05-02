import { describe, expect, it } from "vitest";
import type { Scene } from "../domain";
import {
  applyLocalEffects,
  createActiveSceneSession,
  getAvailableBeatChoices,
  getCurrentBeat,
  getSceneChoices
} from "./sceneBeats";

const beatScene: Scene = {
  id: "test-beat-scene",
  title: "Test Beat Scene",
  type: "test",
  description: "A beat scene for tests.",
  localProperties: {
    trust: { initial: 1, min: 0, max: 2 },
    pressure: { initial: 0, min: 0, max: 2 },
    posture: { initial: "undecided" },
    seen: { initial: false }
  },
  startBeatId: "arrival",
  beats: {
    arrival: {
      id: "arrival",
      text: "Arrival.",
      choices: [
        {
          id: "gentle",
          label: "Gentle",
          localEffects: [
            { kind: "changeLocal", key: "trust", delta: 1 },
            { kind: "setLocal", key: "posture", value: "gentle" }
          ],
          nextBeatId: "follow-up"
        }
      ]
    },
    "follow-up": {
      id: "follow-up",
      text: "Follow up.",
      choices: [
        {
          id: "trust-option",
          label: "Trust option",
          availability: { all: [{ key: "trust", min: 2 }] },
          endsScene: true
        },
        {
          id: "posture-option",
          label: "Posture option",
          availability: { all: [{ key: "posture", equals: "gentle" }] },
          endsScene: true
        }
      ]
    }
  }
};

describe("sceneBeats", () => {
  it("creates active scene sessions from authored local property defaults", () => {
    const session = createActiveSceneSession(beatScene);

    expect(session).toEqual({
      sceneId: "test-beat-scene",
      currentBeatId: "arrival",
      localState: {
        trust: 1,
        pressure: 0,
        posture: "undecided",
        seen: false
      },
      choicesMade: []
    });
  });

  it("reads the start beat before a session and the current beat during a session", () => {
    expect(getCurrentBeat(beatScene)?.id).toBe("arrival");
    expect(
      getCurrentBeat(beatScene, {
        sceneId: "test-beat-scene",
        currentBeatId: "follow-up",
        localState: {},
        choicesMade: []
      })?.id
    ).toBe("follow-up");
  });

  it("filters choices by local all, any, equals, present, min, and max conditions", () => {
    const choices = getAvailableBeatChoices(
      [
        { id: "all-pass", label: "All pass", availability: { all: [{ key: "trust", min: 1 }] } },
        { id: "any-pass", label: "Any pass", availability: { any: [{ key: "pressure", min: 2 }, { key: "posture", equals: "gentle" }] } },
        { id: "present-pass", label: "Present pass", availability: { all: [{ key: "seen", present: true }] } },
        { id: "max-pass", label: "Max pass", availability: { all: [{ key: "pressure", max: 1 }] } },
        { id: "equals-fail", label: "Equals fail", availability: { all: [{ key: "posture", equals: "hard" }] } },
        { id: "present-fail", label: "Present fail", availability: { all: [{ key: "missing", present: true }] } }
      ],
      {
        trust: 1,
        pressure: 1,
        posture: "gentle",
        seen: false
      }
    );

    expect(choices.map((choice) => choice.id)).toEqual([
      "all-pass",
      "any-pass",
      "present-pass",
      "max-pass"
    ]);
  });

  it("applies local effects and clamps numeric local state", () => {
    const raised = applyLocalEffects(
      { trust: 1, posture: "undecided" },
      [
        { kind: "changeLocal", key: "trust", delta: 4 },
        { kind: "setLocal", key: "posture", value: "gentle" }
      ],
      beatScene.localProperties
    );
    const lowered = applyLocalEffects(
      { trust: 1 },
      [{ kind: "changeLocal", key: "trust", delta: -4 }],
      beatScene.localProperties
    );

    expect(raised).toMatchObject({ trust: 2, posture: "gentle" });
    expect(lowered).toMatchObject({ trust: 0 });
  });

  it("returns current beat choices using active local state", () => {
    const choices = getSceneChoices(beatScene, {
      sceneId: "test-beat-scene",
      currentBeatId: "follow-up",
      localState: {
        trust: 2,
        posture: "gentle"
      },
      choicesMade: ["gentle"]
    });

    expect(choices.map((choice) => choice.id)).toEqual([
      "trust-option",
      "posture-option"
    ]);
  });
});
