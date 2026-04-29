import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: A regular buys sleep drops for the fourth time this week and smiles too brightly.
 * The boundary of care: when does a sale become permission to ask the harder question?
 */
const scene: SceneCard = {
  id: "regular-not-okay",
  title: "The Regular Who Is Not Okay",
  type: "customer",
  description:
    "A regular buys sleep drops for the fourth time this week and smiles as if that should settle the matter.",
  coreQuestion: "When does a sale become permission to ask a harder question?",
  boons: [{ label: "They trust your shop enough to return." }],
  banes: [{ label: "Pressing too hard may send them elsewhere." }],
  choices: [
    {
      id: "ask-hard",
      label: "Ask the harder question",
      effects: [
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: 0.2
        },
        { kind: "entityGauge", entityId: "player", key: "compassion", delta: 0.2 },
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: 2 },
        { kind: "log", text: "They do not answer fully, but they sit down before leaving." }
      ]
    },
    {
      id: "sell-drops",
      label: "Sell the drops without prying",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "stock", delta: -1 },
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: 6 },
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: 0.1 },
        { kind: "log", text: "The sale is clean. The smile is not." }
      ]
    }
  ]
};

export default scene;
