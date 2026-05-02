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
          id: "count-shortfall",
          label: "Count the shortfall honestly",
          description:
            "Name the gap in the ledger before deciding whether tomorrow should cost more, last longer, or wait.",
          nextBeatId: "rent-bell"
        },
        {
          id: "check-shelf",
          label: "Check what can still be sold",
          description:
            "Look for survival in stock and labor instead of staring only at the coins.",
          nextBeatId: "rent-bell"
        },
        {
          id: "listen-to-rain",
          label: "Let the rain slow your hands",
          description:
            "Notice how tired you are before choosing what the shop is allowed to ask of you.",
          nextBeatId: "rent-bell"
        }
      ]
    },
    "rent-bell": {
      id: "rent-bell",
      title: "The Rent Bell",
      text:
        "The rent bell is days away, but the sound is already in the room. The ledger offers no rescue, only three margins you might still adjust: price, work, or sleep.",
      choices: [
        {
          id: "raise-prices-tomorrow",
          label: "Plan to raise prices tomorrow",
          description:
            "Protect the shop's future by asking customers to carry more of tonight's pressure.",
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
          description:
            "Turn exhaustion into stock while there is still candle enough to make the shelves less bare.",
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
          description:
            "Accept that the coin total will not improve tonight and protect the person who has to face tomorrow.",
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
