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
          id: "ask-why-test",
          label: "Ask why she tested you",
          description:
            "Make her explain the judgment before you decide whether to invite more of it.",
          nextBeatId: "terms-of-kindness"
        },
        {
          id: "show-the-blue-thread",
          label: "Show her the saved blue thread",
          description:
            "Answer her mystery with evidence that you noticed the hand behind the gift.",
          nextBeatId: "terms-of-kindness"
        },
        {
          id: "offer-tea-first",
          label: "Offer tea before terms",
          description:
            "Try to turn a test into a visit before choosing what kind of relationship this becomes.",
          nextBeatId: "terms-of-kindness"
        }
      ]
    },
    "terms-of-kindness": {
      id: "terms-of-kindness",
      title: "Terms of Kindness",
      text:
        "She says apprenticeships used to begin with riddles because clear bargains teach only caution. Then she glances at your shelves and admits caution is not a bad thing for a shop with rent due.",
      choices: [
        {
          id: "accept-mentor",
          label: "Accept her strange mentorship",
          description:
            "Take the stock and the relationship, while insisting that future lessons need cleaner terms.",
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
          description:
            "Keep authority over your threshold, even if refusing her costs standing and future help.",
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
