import type { Scene } from "@aphebis/core";
import { decreaseProperty, gainPropertyAmount, increaseProperty } from "@aphebis/system-cosy-shop";

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
  startBeatId: "hedge-witch",
  beats: {
    "hedge-witch": {
      id: "hedge-witch",
      title: "Unpriced Kindness",
      text:
        "The hedge-witch smiles as if the silence was part of the gift. She admits the moonleaf was hers, and that she wanted to know what you do with kindness before it has terms.",
      choices: [
        {
          id: "accept-mentor",
          label: "Accept her strange mentorship",
          endsScene: true,
          effects: [
            gainPropertyAmount("shop", "stock", 2),
            increaseProperty("shop", "shopStanding", "slightly"),
            increaseProperty("player", "prudence", "slightly"),
            { kind: "log", text: "She laughs when you ask for clearer terms, which is almost an answer." }
          ],
          aftermath: {
            narration:
              "You accepted the connection, though not without asking for clearer terms. She laughed at that, which was almost an answer, and left you with more moonleaf than explanation.",
            spotlightProperties: [
              { entityId: "shop", property: "stock" },
              { entityId: "shop", property: "shopStanding" },
              { entityId: "player", property: "prudence" }
            ],
            futureEchoText: ["A strange mentorship has begun with more test than promise."]
          }
        },
        {
          id: "decline-test",
          label: "Decline the connection",
          endsScene: true,
          effects: [
            increaseProperty("player", "ambition", "slightly"),
            decreaseProperty("shop", "shopStanding", "slightly"),
            {
              kind: "log",
              text: "She respects the refusal, perhaps more than she would have respected obedience."
            }
          ],
          aftermath: {
            narration:
              "You declined the test and the connection that came wrapped inside it. She respected the refusal, perhaps more than she would have respected obedience.",
            spotlightProperties: [
              { entityId: "player", property: "ambition" },
              { entityId: "shop", property: "shopStanding" }
            ],
            futureEchoText: ["The door remains yours to answer, even when gifts are left there."]
          }
        }
      ]
    }
  }
};

export default scene;
