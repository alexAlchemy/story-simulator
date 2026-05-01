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
  choices: [
    {
      id: "accept-help",
      label: "Accept the help",
      description: "Let the exchange be warmer than the receipt.",
      effects: [
        decreaseProperty("player", "fatigue", "moderately"),
        increaseProperty("shop", "goodwill", "slightly"),
        decreaseProperty("player", "ambition", "slightly"),
        { kind: "log", text: "They sweep badly, but they hum while doing it, and the room softens." }
      ]
    },
    {
      id: "keep-boundary",
      label: "Keep the boundary",
      description: "Thank them, but close the shop yourself.",
      effects: [
        increaseProperty("player", "fatigue", "slightly"),
        increaseProperty("shop", "shopStanding", "slightly"),
        { kind: "log", text: "They leave with respect intact and a little unanswered kindness." }
      ]
    },
    {
      id: "trade-for-discount",
      label: "Trade the help for a discount",
      description: "Make the kindness clean by giving it a price.",
      effects: [
        spendPropertyAmount("shop", "coins", 2),
        decreaseProperty("player", "fatigue", "slightly"),
        increaseProperty("shop", "goodwill", "slightly"),
        { kind: "log", text: "The bargain is fair, though something tender goes unnamed." }
      ]
    }
  ]
};

export default scene;
