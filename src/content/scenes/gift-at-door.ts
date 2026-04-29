import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: Rare moonleaf appears at your door, tied with blue thread, no note, no explanation.
 * An invitation into mystery: what kindness asks for nothing, and what does silence really mean?
 */
const scene: SceneCard = {
  id: "gift-at-door",
  title: "A Gift Left at the Door",
  type: "town",
  description:
    "Before opening, you find rare moonleaf tied with blue thread. No note, no footprints, no explanation.",
  coreQuestion: "Can you accept kindness without knowing what it will cost?",
  boons: [{ label: "Rare moonleaf can stretch your stock." }],
  banes: [{ label: "Gifts often mean obligations." }, { label: "The source is unknown.", hidden: true }],
  choices: [
    {
      id: "accept-use",
      label: "Accept and use it",
      effects: [
        { kind: "resource", key: "stock", delta: 2 },
        { kind: "value", key: "ambition", delta: 1 },
        { kind: "setFlag", key: "mysterious_gift_accepted", value: true },
        { kind: "addScene", sceneId: "gift-giver-revealed" },
        { kind: "log", text: "The moonleaf smells of rain, silver, and someone else's expectation." }
      ]
    },
    {
      id: "ask-around",
      label: "Ask around town",
      effects: [
        { kind: "relationship", key: "townTrust", delta: 1 },
        { kind: "value", key: "prudence", delta: 1 },
        { kind: "addScene", sceneId: "gift-giver-revealed" },
        { kind: "log", text: "By noon, three people have theories and nobody has an answer." }
      ]
    },
    {
      id: "leave-thanks",
      label: "Leave a thank-you charm by the door",
      effects: [
        { kind: "resource", key: "stock", delta: 1 },
        { kind: "value", key: "compassion", delta: 1 },
        { kind: "relationship", key: "townTrust", delta: 1 },
        { kind: "setFlag", key: "left_thanks_for_gift", value: true },
        { kind: "log", text: "The charm warms once at dusk, as if someone passed close enough to notice." }
      ]
    }
  ],
  clock: { transformsOnDay: 4, transformsInto: "gift-giver-revealed" }
};

export default scene;
