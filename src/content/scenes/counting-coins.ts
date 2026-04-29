import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: Midnight arrives. The shop is quiet. You count the coins twice and the number stays wrong.
 * A private reckoning: what does survival cost when measured in sleep, work, and self-care?
 */
const scene: SceneCard = {
  id: "counting-coins",
  title: "Counting Coins at Midnight",
  type: "reflection",
  description:
    "The shop is quiet. Rain taps the window. You count the coins twice and still imagine the rent bell.",
  choices: [
    {
      id: "raise-prices-tomorrow",
      label: "Plan to raise prices tomorrow",
      effects: [
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: 0.1 },
        { kind: "log", text: "You mark three prices in darker ink and do not sleep immediately after." }
      ]
    },
    {
      id: "work-late",
      label: "Work late bottling simple remedies",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "stock", delta: 1 },
        { kind: "entityGauge", entityId: "player", key: "fatigue", delta: 0.2 },
        { kind: "entityGauge", entityId: "player", key: "ambition", delta: 0.1 },
        { kind: "log", text: "By candle-end, six labels are straight and your hands ache." }
      ]
    },
    {
      id: "rest",
      label: "Close your eyes and rest",
      effects: [
        { kind: "entityGauge", entityId: "player", key: "fatigue", delta: -0.2 },
        { kind: "entityGauge", entityId: "player", key: "compassion", delta: 0.1 },
        { kind: "log", text: "For one night, you treat yourself like someone worth preserving." }
      ]
    }
  ]
};

export default scene;
