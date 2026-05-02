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
  startBeatId: "front-counter",
  beats: {
    "front-counter": {
      id: "front-counter",
      title: "One Hour Alone",
      text:
        "They ask for one hour at the counter while you work in the back room. The till, the bottles, and their hope all wait for your answer.",
      choices: [
        {
          id: "trust-counter",
          label: "Trust them with the counter",
          endsScene: true,
          effects: [
            gainPropertyAmount("shop", "coins", 5),
            decreaseProperty("player", "fatigue", "slightly"),
            increaseProperty("apprentice", "trust", "moderately"),
            increaseProperty("apprentice", "affection", "slightly"),
            { kind: "log", text: "They mispronounce one tincture and make three honest sales anyway." }
          ],
          aftermath: {
            narration:
              "You left them with the counter and the bell. They mispronounced one tincture, made three honest sales anyway, and looked different when you came back.",
            spotlightProperties: [
              { entityId: "shop", property: "coins" },
              { entityId: "player", property: "fatigue" },
              { entityId: "apprentice", property: "trust" },
              { entityId: "apprentice", property: "affection" }
            ],
            futureEchoText: ["They have now felt what it is like to be trusted before being perfect."]
          }
        },
        {
          id: "supervise",
          label: "Supervise closely",
          endsScene: true,
          effects: [
            gainPropertyAmount("shop", "coins", 4),
            decreaseProperty("apprentice", "trust", "slightly"),
            decreaseProperty("apprentice", "affection", "slightly"),
            increaseProperty("player", "prudence", "slightly"),
            { kind: "log", text: "Nothing goes wrong, which somehow proves less than either of you hoped." }
          ],
          aftermath: {
            narration:
              "You stayed near enough to catch every wobble before it became a mistake. Nothing went wrong, which somehow proved less than either of you hoped.",
            spotlightProperties: [
              { entityId: "shop", property: "coins" },
              { entityId: "apprentice", property: "trust" },
              { entityId: "apprentice", property: "affection" },
              { entityId: "player", property: "prudence" }
            ],
            futureEchoText: ["The counter stayed safe. Their confidence had less room to stretch."]
          }
        }
      ]
    }
  }
};

export default scene;
