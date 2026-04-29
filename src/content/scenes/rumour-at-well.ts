import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: The town has started explaining your shop to itself.
 * Reputation pressure: do you quiet the story, use it, or ask the town to carry some of it for you?
 */
const scene: SceneCard = {
  id: "rumour-at-well",
  title: "Rumour at the Well",
  type: "town",
  description:
    "At the well, two neighbours stop talking when they see you. The shop has become a story, and nobody agrees what kind.",
  choices: [
    {
      id: "answer-plainly",
      label: "Answer the rumours plainly",
      description: "Give the town fewer shadows to embroider.",
      effects: [
        { kind: "entityGauge", entityId: "town", key: "gossipHeat", delta: -0.2 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: 0.1
        },
        { kind: "entityGauge", entityId: "player", key: "fatigue", delta: 0.1 },
        { kind: "log", text: "By noon, the story is smaller, duller, and more nearly true." }
      ]
    },
    {
      id: "lean-into-mystique",
      label: "Let the mystery do its work",
      description: "A little wonder can bring customers through the door.",
      effects: [
        { kind: "entityGauge", entityId: "town", key: "gossipHeat", delta: 0.2 },
        { kind: "entityGauge", entityId: "player", key: "ambition", delta: 0.1 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "goodwill",
          delta: -0.1
        },
        { kind: "log", text: "The next customer asks whether your bottles glow when no one watches." }
      ]
    },
    {
      id: "ask-regular-to-speak",
      label: "Ask a regular to speak for you",
      description: "Let someone else's faith become part of the shop's voice.",
      effects: [
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "goodwill",
          delta: 0.2
        },
        { kind: "entityGauge", entityId: "town", key: "gossipHeat", delta: -0.1 },
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: -2 },
        { kind: "entityGauge", entityId: "player", key: "ambition", delta: -0.1 },
        { kind: "log", text: "Old Mara takes the discount and spends it loudly on your good name." }
      ]
    }
  ]
};

export default scene;
