import type { SceneCard } from "../../domain/types";

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
  coreQuestion: "Is your shop a business, a refuge, or something in between?",
  boons: [{ label: "You have one fever draught already brewed." }],
  banes: [{ label: "Stock is low." }, { label: "Rent is due soon." }],
  choices: [
    {
      id: "free-draught",
      label: "Give him the draught for free",
      description: "Let need matter more than the till.",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "stock", delta: -1 },
        { kind: "entityGauge", entityId: "player", key: "compassion", delta: 0.2 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: 0.1
        },
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
        { kind: "entityQuantity", entityId: "shop", key: "stock", delta: -1 },
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: 3 },
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: 0.1 },
        { kind: "entityGauge", entityId: "player", key: "compassion", delta: 0.1 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: 0.1
        },
        { kind: "log", text: "Three wet coins land in the drawer, lighter than they should feel." }
      ]
    },
    {
      id: "refuse",
      label: "Refuse the sale",
      description: "You cannot keep the doors open by giving away what you need.",
      effects: [
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: 0.2 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: -0.1
        },
        { kind: "setFlag", key: "stablehand_refused", value: true },
        { kind: "log", text: "He nods once, too politely, and the bell over the door sounds colder." }
      ]
    }
  ]
};

export default scene;
