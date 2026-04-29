import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: A travelling supplier offers discounted ingredients with labels that look almost official.
 * A gamble on scarcity: what risk feels acceptable when shortage is already risky?
 */
const scene: SceneCard = {
  id: "supplier-cheap-stock",
  title: "Supplier Offers Cheap Stock",
  type: "shop",
  description:
    "A travelling supplier offers discounted ingredients with labels that look almost official.",
  coreQuestion: "What kind of risk feels acceptable when scarcity is already risky?",
  boons: [{ label: "The price is very good." }],
  banes: [{ label: "Cheap stock can become expensive later." }],
  choices: [
    {
      id: "buy-cheap",
      label: "Buy the cheap stock",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: -6 },
        { kind: "entityQuantity", entityId: "shop", key: "stock", delta: 3 },
        { kind: "entityGauge", entityId: "player", key: "ambition", delta: 0.1 },
        { kind: "setFlag", key: "cheap_stock_bought", value: true },
        { kind: "log", text: "The bottles clink cheerfully in the crate. Too cheerfully, maybe." }
      ]
    },
    {
      id: "buy-little",
      label: "Buy only what you can inspect",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: -3 },
        { kind: "entityQuantity", entityId: "shop", key: "stock", delta: 1 },
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: 0.1 },
        { kind: "log", text: "You reject half the crate and sleep better for it." }
      ]
    }
  ]
};

export default scene;
