import type { SceneCard } from "@aphebis/core";
import { log, player, shop } from "@aphebis/system-cosy-shop";

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
        player.gainPrudence("slightly"),
        log("You mark three prices in darker ink and do not sleep immediately after.")
      ]
    },
    {
      id: "work-late",
      label: "Work late bottling simple remedies",
      effects: [
        shop.gainStock(1),
        player.gainFatigue("moderately"),
        player.gainAmbition("slightly"),
        log("By candle-end, six labels are straight and your hands ache.")
      ]
    },
    {
      id: "rest",
      label: "Close your eyes and rest",
      effects: [
        player.recoverFatigue("moderately"),
        player.gainCompassion("slightly"),
        log("For one night, you treat yourself like someone worth preserving.")
      ]
    }
  ]
};

export default scene;
