import type { SceneCard } from "../../domain";
import { gainQuantity, increaseEntityGauge, increaseRelationshipDimension } from "../effects";

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
  choices: [
    {
      id: "accept-use",
      label: "Accept and use it",
      effects: [
        gainQuantity("shop", "stock", 2),
        increaseEntityGauge("player", "ambition", "slightly"),
        { kind: "setFlag", key: "mysterious_gift_accepted", value: true },
        { kind: "addScene", sceneId: "gift-giver-revealed" },
        { kind: "log", text: "The moonleaf smells of rain, silver, and someone else's expectation." }
      ]
    },
    {
      id: "ask-around",
      label: "Ask around town",
      effects: [
        increaseRelationshipDimension("town->shop", "trust", "slightly"),
        increaseEntityGauge("player", "prudence", "slightly"),
        { kind: "addScene", sceneId: "gift-giver-revealed" },
        { kind: "log", text: "By noon, three people have theories and nobody has an answer." }
      ]
    },
    {
      id: "leave-thanks",
      label: "Leave a thank-you charm by the door",
      effects: [
        gainQuantity("shop", "stock", 1),
        increaseEntityGauge("player", "compassion", "slightly"),
        increaseRelationshipDimension("town->shop", "trust", "slightly"),
        { kind: "setFlag", key: "left_thanks_for_gift", value: true },
        { kind: "log", text: "The charm warms once at dusk, as if someone passed close enough to notice." }
      ]
    }
  ]
};

export default scene;
