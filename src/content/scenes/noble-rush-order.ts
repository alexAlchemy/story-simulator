import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: A noble's steward wants a vanity elixir by dusk and offers enough coin to make rent feel possible.
 * Survival at a price: will you spend medicine on vanity when people are suffering?
 */
const scene: SceneCard = {
  id: "noble-rush-order",
  title: "Noble Rush Order",
  type: "customer",
  description:
    "A noble's steward wants a vanity elixir by dusk and offers enough coin to make rent feel possible.",
  coreQuestion: "Do you serve vanity when survival is on the counter?",
  boons: [{ label: "The payment is immediate." }],
  banes: [{ label: "The order consumes medicine-grade stock." }],
  choices: [
    {
      id: "take-order",
      label: "Take the order",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "stock", delta: -2 },
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: 18 },
        { kind: "entityGauge", entityId: "player", key: "ambition", delta: 0.2 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: -0.1
        },
        { kind: "log", text: "The steward pays in silver. The shelf behind you looks suddenly vulnerable." }
      ]
    },
    {
      id: "redirect",
      label: "Offer a cheaper harmless tonic",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "stock", delta: -1 },
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: 8 },
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: 0.1 },
        { kind: "log", text: "The steward sniffs at the bottle, then pays because it is still fashionable." }
      ]
    },
    {
      id: "refuse-vanity",
      label: "Refuse to spend medicine on vanity",
      effects: [
        { kind: "entityGauge", entityId: "player", key: "compassion", delta: 0.2 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: 0.1
        },
        {
          kind: "log",
          text: "The steward is offended. The next fever case will not know your name, but they may live."
        }
      ]
    }
  ]
};

export default scene;
