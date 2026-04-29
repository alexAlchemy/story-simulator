import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: The rent figure glares from the ledger. A new price slate waits by the till.
 * The arithmetic of fairness: can you survive without pricing people out of the help they need?
 */
const scene: SceneCard = {
  id: "raise-prices",
  title: "Raise Prices?",
  type: "shop",
  description:
    "The rent figure glares from the ledger. A new price slate waits beside the till.",
  coreQuestion: "Can fairness survive arithmetic?",
  boons: [{ label: "Higher prices could close the rent gap." }],
  banes: [{ label: "Desperate people rely on predictable costs." }],
  choices: [
    {
      id: "raise-all",
      label: "Raise all prices",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: 10 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: -0.2
        },
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: 0.2 },
        { kind: "log", text: "The new numbers look sensible until the first customer reads them." }
      ]
    },
    {
      id: "sliding-scale",
      label: "Use a quiet sliding scale",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: 5 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: 0.1
        },
        { kind: "entityGauge", entityId: "player", key: "compassion", delta: 0.1 },
        { kind: "log", text: "Nobody sees the whole system, but several people leave breathing easier." }
      ]
    }
  ]
};

export default scene;
