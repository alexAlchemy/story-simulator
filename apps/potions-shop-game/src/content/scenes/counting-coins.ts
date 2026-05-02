import type { Scene } from "@aphebis/core";
import { log, player, shop } from "@aphebis/system-cosy-shop";

/**
 * PREMISE: Midnight arrives. The shop is quiet. You count the coins twice and the number stays wrong.
 * A private reckoning: what does survival cost when measured in sleep, work, and self-care?
 */
const scene: Scene = {
  id: "counting-coins",
  title: "Counting Coins at Midnight",
  type: "reflection",
  description:
    "The shop is quiet. Rain taps the window. You count the coins twice and still imagine the rent bell.",
  startBeatId: "midnight-ledger",
  beats: {
    "midnight-ledger": {
      id: "midnight-ledger",
      title: "The Number Stays Wrong",
      text:
        "The coins make the same small sound every time you count them. The total does not change, no matter how carefully you line the stacks.",
      choices: [
        {
          id: "raise-prices-tomorrow",
          label: "Plan to raise prices tomorrow",
          endsScene: true,
          effects: [
            player.gainPrudence("slightly"),
            log("You mark three prices in darker ink and do not sleep immediately after.")
          ],
          aftermath: {
            narration:
              "You marked three prices in darker ink. The plan was small, practical, and sharp enough to keep you awake a little longer.",
            spotlightProperties: [{ entityId: "player", property: "prudence" }],
            futureEchoText: ["Tomorrow's prices will carry tonight's arithmetic."]
          }
        },
        {
          id: "work-late",
          label: "Work late bottling simple remedies",
          endsScene: true,
          effects: [
            shop.gainStock(1),
            player.gainFatigue("moderately"),
            player.gainAmbition("slightly"),
            log("By candle-end, six labels are straight and your hands ache.")
          ],
          aftermath: {
            narration:
              "You lit another candle and made the quiet useful. By candle-end, six labels were straight, the shelf was less bare, and your hands ached.",
            spotlightProperties: [
              { entityId: "shop", property: "stock" },
              { entityId: "player", property: "fatigue" },
              { entityId: "player", property: "ambition" }
            ],
            futureEchoText: ["The shelves are better prepared. Your body paid for it."]
          }
        },
        {
          id: "rest",
          label: "Close your eyes and rest",
          endsScene: true,
          effects: [
            player.recoverFatigue("moderately"),
            player.gainCompassion("slightly"),
            log("For one night, you treat yourself like someone worth preserving.")
          ],
          aftermath: {
            narration:
              "You left the coins as they were and closed your eyes. For one night, you treated yourself like someone worth preserving.",
            spotlightProperties: [
              { entityId: "player", property: "fatigue" },
              { entityId: "player", property: "compassion" }
            ],
            futureEchoText: ["The rent bell still waits, but you will meet it less frayed."]
          }
        }
      ]
    }
  }
};

export default scene;
