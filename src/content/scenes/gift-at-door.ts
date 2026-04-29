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
  choices: [
    {
      id: "accept-use",
      label: "Accept and use it",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "stock", delta: 2 },
        { kind: "entityGauge", entityId: "player", key: "ambition", delta: 0.1 },
        { kind: "setFlag", key: "mysterious_gift_accepted", value: true },
        { kind: "addScene", sceneId: "gift-giver-revealed" },
        { kind: "log", text: "The moonleaf smells of rain, silver, and someone else's expectation." }
      ]
    },
    {
      id: "ask-around",
      label: "Ask around town",
      effects: [
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: 0.1
        },
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: 0.1 },
        { kind: "addScene", sceneId: "gift-giver-revealed" },
        { kind: "log", text: "By noon, three people have theories and nobody has an answer." }
      ]
    },
    {
      id: "leave-thanks",
      label: "Leave a thank-you charm by the door",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "stock", delta: 1 },
        { kind: "entityGauge", entityId: "player", key: "compassion", delta: 0.1 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: 0.1
        },
        { kind: "setFlag", key: "left_thanks_for_gift", value: true },
        { kind: "log", text: "The charm warms once at dusk, as if someone passed close enough to notice." }
      ]
    }
  ]
};

export default scene;
