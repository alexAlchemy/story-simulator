import type { Scene } from "@aphebis/core";
import { decreaseProperty, gainPropertyAmount, increaseProperty } from "@aphebis/system-cosy-shop";

/**
 * PREMISE: Your apprentice asks to handle the front counter alone while you work the back room.
 * A test of delegation: do you make room for someone else to become capable, or protect the till?
 */
const scene: Scene = {
  id: "apprentice-asks-trust",
  title: "Apprentice Asks for Trust",
  type: "staff",
  description:
    "Your apprentice asks to handle the front counter alone for one hour while you prepare the back room.",
  choices: [
    {
      id: "trust-counter",
      label: "Trust them with the counter",
      effects: [
        gainPropertyAmount("shop", "coins", 5),
        decreaseProperty("player", "fatigue", "slightly"),
        increaseProperty("apprentice", "trust", "moderately"),
        increaseProperty("apprentice", "affection", "slightly"),
        { kind: "log", text: "They mispronounce one tincture and make three honest sales anyway." }
      ]
    },
    {
      id: "supervise",
      label: "Supervise closely",
      effects: [
        gainPropertyAmount("shop", "coins", 4),
        decreaseProperty("apprentice", "trust", "slightly"),
        decreaseProperty("apprentice", "affection", "slightly"),
        increaseProperty("player", "prudence", "slightly"),
        { kind: "log", text: "Nothing goes wrong, which somehow proves less than either of you hoped." }
      ]
    }
  ]
};

export default scene;
