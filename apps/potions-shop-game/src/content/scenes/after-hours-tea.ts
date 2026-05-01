import type { Scene } from "@aphebis/core";
import {
  decreaseProperty,
  increaseProperty,
  spendPropertyAmount
} from "@aphebis/system-cosy-shop";

/**
 * PREMISE: The apprentice lingers after closing with a cup of tea and too much on their mind.
 * The player is bribed, deflected, or invited in: what kind of closeness do you allow?
 */
const scene: Scene = {
  id: "after-hours-tea",
  title: "After-Hours Tea",
  type: "staff",
  description:
    "The shop is shut, but the apprentice stays by the counter with a cooling cup of tea and an unfinished thought.",
  choices: [
    {
      id: "listen-closely",
      label: "Listen to the whole story",
      description: "Give the moment its full attention.",
      effects: [
        increaseProperty("apprentice", "affection", "strongly"),
        increaseProperty("apprentice", "affection", "moderately"),
        increaseProperty("apprentice", "trust", "moderately"),
        decreaseProperty("player", "fatigue", "slightly"),
        { kind: "log", text: "The story is ordinary, except for the part where it makes the room feel safer." }
      ]
    },
    {
      id: "redirect-to-work",
      label: "Deflect back to the work",
      description: "Keep the evening practical and a little distant.",
      effects: [
        increaseProperty("player", "prudence", "slightly"),
        increaseProperty("apprentice", "trust", "slightly"),
        decreaseProperty("apprentice", "affection", "slightly"),
        { kind: "log", text: "You talk shelf order until the story loses some of its heat." }
      ]
    },
    {
      id: "buy-quiet",
      label: "Buy them a pastry and ask for silence",
      description: "Pay a small cost to avoid the moment without quite refusing it.",
      effects: [
        spendPropertyAmount("shop", "coins", 2),
        increaseProperty("apprentice", "affection", "slightly"),
        increaseProperty("player", "compassion", "slightly"),
        { kind: "log", text: "The pastry works. So does the silence, though only for tonight." }
      ]
    }
  ]
};

export default scene;
