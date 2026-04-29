import type { SceneCard } from "../../domain/types";
import { decreaseRelationshipDimension, gainQuantity, increaseEntityGauge, increaseRelationshipDimension, spendQuantity } from "../effects";

/**
 * PREMISE: A soaked stranger arrives at closing with three copper coins and a dying sister.
 * The shop's first test: does a potion shop serve the desperate, or just those who can pay?
 */
const scene: SceneCard = {
  id: "desperate-stablehand",
  title: "The Desperate Stablehand",
  type: "customer",
  description:
    "A soaked stablehand arrives near closing. His little sister has a fever, and he has only three copper coins.",
  choices: [
    {
      id: "free-draught",
      label: "Give him the draught for free",
      description: "Let need matter more than the till.",
      effects: [
        spendQuantity("shop", "stock", 1),
        increaseEntityGauge("player", "compassion", "moderately"),
        increaseRelationshipDimension("town->shop", "trust", "slightly"),
        {
          kind: "addRelationshipToken",
          relationshipId: "town->shop",
          token: {
            id: "stablehand-helped",
            kind: "favour",
            label: "Helped the stablehand's sister",
            description: "Word may spread that the shop helps desperate families.",
            sourceSceneId: "desperate-stablehand"
          }
        },
        { kind: "setFlag", key: "stablehand_grateful", value: true },
        { kind: "log", text: "The stablehand leaves clutching the draught like a candle in the rain." }
      ]
    },
    {
      id: "sell-for-three",
      label: "Take his three coins",
      description: "Help him, but keep the sale recorded.",
      effects: [
        spendQuantity("shop", "stock", 1),
        gainQuantity("shop", "coins", 3),
        increaseEntityGauge("player", "prudence", "slightly"),
        increaseEntityGauge("player", "compassion", "slightly"),
        increaseRelationshipDimension("town->shop", "trust", "slightly"),
        { kind: "log", text: "Three wet coins land in the drawer, lighter than they should feel." }
      ]
    },
    {
      id: "refuse",
      label: "Refuse the sale",
      description: "You cannot keep the doors open by giving away what you need.",
      effects: [
        increaseEntityGauge("player", "prudence", "moderately"),
        decreaseRelationshipDimension("town->shop", "trust", "slightly"),
        { kind: "setFlag", key: "stablehand_refused", value: true },
        { kind: "log", text: "He nods once, too politely, and the bell over the door sounds colder." }
      ]
    }
  ]
};

export default scene;
