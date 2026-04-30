import type { SceneCard } from "@aphebis/core";
import { decreaseEntityGauge, gainQuantity, increaseEntityGauge } from "../effects";

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
        increaseEntityGauge("player", "prudence", "slightly"),
        { kind: "log", text: "You mark three prices in darker ink and do not sleep immediately after." }
      ]
    },
    {
      id: "work-late",
      label: "Work late bottling simple remedies",
      effects: [
        gainQuantity("shop", "stock", 1),
        increaseEntityGauge("player", "fatigue", "moderately"),
        increaseEntityGauge("player", "ambition", "slightly"),
        { kind: "log", text: "By candle-end, six labels are straight and your hands ache." }
      ]
    },
    {
      id: "rest",
      label: "Close your eyes and rest",
      effects: [
        decreaseEntityGauge("player", "fatigue", "moderately"),
        increaseEntityGauge("player", "compassion", "slightly"),
        { kind: "log", text: "For one night, you treat yourself like someone worth preserving." }
      ]
    }
  ]
};

export default scene;
