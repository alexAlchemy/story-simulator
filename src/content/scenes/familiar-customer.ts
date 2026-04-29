import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: A regular customer notices your exhaustion and offers ordinary help.
 * Intimacy at the counter: do you accept care, preserve boundaries, or make help transactional?
 */
const scene: SceneCard = {
  id: "familiar-customer",
  title: "The Familiar Customer",
  type: "customer",
  description:
    "A quiet regular sees your shaking hands as you close. They offer to sweep and shutter the shop while you sit.",
  choices: [
    {
      id: "accept-help",
      label: "Accept the help",
      description: "Let the relationship be warmer than the receipt.",
      effects: [
        { kind: "entityGauge", entityId: "player", key: "fatigue", delta: -0.2 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "goodwill",
          delta: 0.1
        },
        { kind: "entityGauge", entityId: "player", key: "ambition", delta: -0.1 },
        { kind: "log", text: "They sweep badly, but they hum while doing it, and the room softens." }
      ]
    },
    {
      id: "keep-boundary",
      label: "Keep the boundary",
      description: "Thank them, but close the shop yourself.",
      effects: [
        { kind: "entityGauge", entityId: "player", key: "fatigue", delta: 0.1 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: 0.1
        },
        { kind: "log", text: "They leave with respect intact and a little unanswered kindness." }
      ]
    },
    {
      id: "trade-for-discount",
      label: "Trade the help for a discount",
      description: "Make the kindness clean by giving it a price.",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: -2 },
        { kind: "entityGauge", entityId: "player", key: "fatigue", delta: -0.1 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "goodwill",
          delta: 0.1
        },
        { kind: "log", text: "The bargain is fair, though something tender goes unnamed." }
      ]
    }
  ]
};

export default scene;
