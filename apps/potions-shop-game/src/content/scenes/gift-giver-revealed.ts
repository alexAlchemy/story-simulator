import type { Scene } from "@aphebis/core";
import { decreaseEntityGauge, gainQuantity, increaseEntityGauge } from "@aphebis/system-cosy-shop";

/**
 * PREMISE: An old hedge-witch admits the moonleaf was hers—a test of what you do with unpriced kindness.
 * Building connection through judgment: can a test become genuine trust?
 */
const scene: Scene = {
  id: "gift-giver-revealed",
  title: "The Gift Giver Revealed",
  type: "town",
  description:
    "An old hedge-witch admits the moonleaf was hers. She wanted to know what you do with unpriced kindness.",
  choices: [
    {
      id: "accept-mentor",
      label: "Accept her strange mentorship",
      effects: [
        gainQuantity("shop", "stock", 2),
        increaseEntityGauge("shop", "shopStanding", "slightly"),
        increaseEntityGauge("player", "prudence", "slightly"),
        { kind: "log", text: "She laughs when you ask for clearer terms, which is almost an answer." }
      ]
    },
    {
      id: "decline-test",
      label: "Decline the connection",
      effects: [
        increaseEntityGauge("player", "ambition", "slightly"),
        decreaseEntityGauge("shop", "shopStanding", "slightly"),
        {
          kind: "log",
          text: "She respects the refusal, perhaps more than she would have respected obedience."
        }
      ]
    }
  ]
};

export default scene;
