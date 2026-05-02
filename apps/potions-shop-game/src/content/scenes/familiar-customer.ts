import type { Scene } from "@aphebis/core";
import { decreaseProperty, increaseProperty, spendPropertyAmount } from "@aphebis/system-cosy-shop";

/**
 * PREMISE: A regular customer notices your exhaustion and offers ordinary help.
 * Intimacy at the counter: do you accept care, preserve boundaries, or make help transactional?
 */
const scene: Scene = {
  id: "familiar-customer",
  title: "The Familiar Customer",
  type: "customer",
  description:
    "A quiet regular sees your shaking hands as you close. They offer to sweep and shutter the shop while you sit.",
  startBeatId: "shaking-hands",
  beats: {
    "shaking-hands": {
      id: "shaking-hands",
      title: "Offered Help",
      text:
        "The regular has already noticed your shaking hands. They offer to sweep and shutter the shop while you sit, and the kindness arrives without a price.",
      choices: [
        {
          id: "admit-tired",
          label: "Admit the day has been long",
          description:
            "Let them see the need plainly before deciding whether help can cross the counter.",
          nextBeatId: "unpriced-help"
        },
        {
          id: "make-light-of-it",
          label: "Make light of your hands",
          description:
            "Keep dignity in place while giving the kindness one more chance to retreat.",
          nextBeatId: "unpriced-help"
        },
        {
          id: "ask-why-offer",
          label: "Ask why they are offering",
          description:
            "Find out whether this is pity, friendship, or just practical decency.",
          nextBeatId: "unpriced-help"
        }
      ]
    },
    "unpriced-help": {
      id: "unpriced-help",
      title: "Unpriced Help",
      text:
        "They pick up the broom without claiming heroism. 'You sold my mother sleep last winter,' they say. 'Let me sell you ten minutes of sitting down.' The bell-rope waits by the door.",
      choices: [
        {
          id: "accept-help",
          label: "Accept the help",
          description: "Let the exchange be warmer than the receipt.",
          endsScene: true,
          effects: [
            decreaseProperty("player", "fatigue", "moderately"),
            increaseProperty("shop", "goodwill", "slightly"),
            decreaseProperty("player", "ambition", "slightly"),
            { kind: "log", text: "They sweep badly, but they hum while doing it, and the room softens." }
          ],
          aftermath: {
            narration:
              "You sat down and let them help. They swept badly, but they hummed while doing it, and the room softened around the sound.",
            spotlightProperties: [
              { entityId: "player", property: "fatigue" },
              { entityId: "shop", property: "goodwill" },
              { entityId: "player", property: "ambition" }
            ],
            futureEchoText: ["The counter has held something warmer than a receipt."]
          }
        },
        {
          id: "keep-boundary",
          label: "Keep the boundary",
          description: "Thank them, but close the shop yourself.",
          endsScene: true,
          effects: [
            increaseProperty("player", "fatigue", "slightly"),
            increaseProperty("shop", "shopStanding", "slightly"),
            { kind: "log", text: "They leave with respect intact and a little unanswered kindness." }
          ],
          aftermath: {
            narration:
              "You thanked them and closed the shop yourself. They left with respect intact and a little unanswered kindness between you.",
            spotlightProperties: [
              { entityId: "player", property: "fatigue" },
              { entityId: "shop", property: "shopStanding" }
            ],
            futureEchoText: ["The boundary held, even where care pressed gently against it."]
          }
        },
        {
          id: "trade-for-discount",
          label: "Trade the help for a discount",
          description: "Make the kindness clean by giving it a price.",
          endsScene: true,
          effects: [
            spendPropertyAmount("shop", "coins", 2),
            decreaseProperty("player", "fatigue", "slightly"),
            increaseProperty("shop", "goodwill", "slightly"),
            { kind: "log", text: "The bargain is fair, though something tender goes unnamed." }
          ],
          aftermath: {
            narration:
              "You made the help into a bargain. It was fair, and the shop was easier to close, though something tender went unnamed.",
            spotlightProperties: [
              { entityId: "shop", property: "coins" },
              { entityId: "player", property: "fatigue" },
              { entityId: "shop", property: "goodwill" }
            ],
            futureEchoText: ["The help was accepted, but only after it could be priced."]
          }
        }
      ]
    }
  }
};

export default scene;
