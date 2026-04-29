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
        { kind: "relationship", key: "townTrust", delta: 2 },
        { kind: "value", key: "compassion", delta: 2 },
        { kind: "resource", key: "coins", delta: 2 },
        { kind: "log", text: "They do not answer fully, but they sit down before leaving." }
      ]
    },
    {
      id: "sell-drops",
      label: "Sell the drops without prying",
      effects: [
        { kind: "resource", key: "stock", delta: -1 },
        { kind: "resource", key: "coins", delta: 6 },
        { kind: "value", key: "prudence", delta: 1 },
        { kind: "log", text: "The sale is clean. The smile is not." }
      ]
    }
  ]
};

export default scene;
