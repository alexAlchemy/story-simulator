import type { SceneCard } from "../../domain/types";
import { decreaseEntityGauge, decreaseRelationshipDimension, gainQuantity, increaseEntityGauge, increaseRelationshipDimension, spendQuantity } from "../effects";

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
  availability: {
    all: [
      { kind: "day", min: 4 },
      {
        kind: "relationshipToken",
        relationshipId: "town->shop",
        tokenId: "stablehand-helped"
      }
    ]
  },
  choices: [
    {
      id: "accept-favour",
      label: "Accept the favour",
      description: "Let gratitude become a useful arrangement.",
      effects: [
        gainQuantity("shop", "coins", 6),
        spendQuantity("shop", "stock", 1),
        increaseRelationshipDimension("town->shop", "goodwill", "slightly"),
        increaseEntityGauge("town", "gossipHeat", "moderately"),
        decreaseEntityGauge("player", "prudence", "moderately"),
        { kind: "log", text: "The cousin pays in advance and leaves through the side door." }
      ]
    },
    {
      id: "refuse-pressure",
      label: "Refuse the pressure gently",
      description: "Keep the old kindness from becoming a hook.",
      effects: [
        increaseRelationshipDimension("town->shop", "goodwill", "slightly"),
        increaseRelationshipDimension("town->shop", "trust", "slightly"),
        spendQuantity("shop", "coins", 1),
        decreaseEntityGauge("player", "ambition", "slightly"),
        { kind: "log", text: "The stablehand looks embarrassed, then relieved to still be welcome." }
      ]
    },
    {
      id: "write-formal-terms",
      label: "Write formal terms",
      description: "Make the favour lawful, limited, and a little cold.",
      effects: [
        gainQuantity("shop", "coins", 3),
        increaseEntityGauge("player", "prudence", "slightly"),
        decreaseEntityGauge("player", "compassion", "slightly"),
        increaseRelationshipDimension("town->shop", "trust", "slightly"),
        decreaseRelationshipDimension("town->shop", "goodwill", "slightly"),
        { kind: "log", text: "The paper protects everyone and warms no one." }
      ]
    }
  ]
};

export default scene;
