import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: Gratitude becomes leverage when a helped family asks for a rule to bend back.
 * Social debt: do you accept, refuse, or formalise the pressure before it owns you?
 */
const scene: SceneCard = {
  id: "debt-called-in",
  title: "A Debt Called In",
  type: "shop",
  description:
    "The stablehand returns with a cousin who can bring paying customers, if you will quietly supply one restricted tonic tonight.",
  choices: [
    {
      id: "accept-favour",
      label: "Accept the favour",
      description: "Let gratitude become a useful arrangement.",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: 6 },
        { kind: "entityQuantity", entityId: "shop", key: "stock", delta: -1 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "goodwill",
          delta: 0.1
        },
        { kind: "entityGauge", entityId: "town", key: "gossipHeat", delta: 0.2 },
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: -0.2 },
        { kind: "log", text: "The cousin pays in advance and leaves through the side door." }
      ]
    },
    {
      id: "refuse-pressure",
      label: "Refuse the pressure gently",
      description: "Keep the old kindness from becoming a hook.",
      effects: [
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "goodwill",
          delta: 0.1
        },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: 0.1
        },
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: -1 },
        { kind: "entityGauge", entityId: "player", key: "ambition", delta: -0.1 },
        { kind: "log", text: "The stablehand looks embarrassed, then relieved to still be welcome." }
      ]
    },
    {
      id: "write-formal-terms",
      label: "Write formal terms",
      description: "Make the favour lawful, limited, and a little cold.",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: 3 },
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: 0.1 },
        { kind: "entityGauge", entityId: "player", key: "compassion", delta: -0.1 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: 0.1
        },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "goodwill",
          delta: -0.1
        },
        { kind: "log", text: "The paper protects everyone and warms no one." }
      ]
    }
  ]
};

export default scene;
