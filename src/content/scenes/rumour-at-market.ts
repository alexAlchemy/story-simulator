import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: Your refusal to help has travelled faster than the stablehand. The market is talking.
 * Damage control: can a clear explanation mend what silence and rumour have broken?
 */
const scene: SceneCard = {
  id: "rumour-at-market",
  title: "Rumour at Market",
  type: "town",
  description:
    "A fruit seller stops talking when you approach. Your refusal has travelled faster than the rainwater.",
  coreQuestion: "Do you defend yourself, repair harm, or let the market talk?",
  boons: [{ label: "A clear explanation might steady your reputation." }],
  banes: [{ label: "People prefer simple stories." }],
  choices: [
    {
      id: "explain-rent",
      label: "Explain the rent pressure plainly",
      effects: [
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: 0.1
        },
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: 0.1 },
        { kind: "log", text: "Some faces soften. Others simply file the explanation away." }
      ]
    },
    {
      id: "offer-small-remedy",
      label: "Offer small remedies at cost",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "stock", delta: -1 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: 0.2
        },
        { kind: "entityGauge", entityId: "player", key: "compassion", delta: 0.1 },
        { kind: "log", text: "You cannot fix one closed door, but you open a smaller one." }
      ]
    }
  ]
};

export default scene;
