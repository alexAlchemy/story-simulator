import type { Scene } from "@aphebis/core";
import { decreaseProperty, gainPropertyAmount, increaseProperty, spendPropertyAmount } from "@aphebis/system-cosy-shop";

/**
 * PREMISE: Gratitude becomes leverage when a helped family asks for a rule to bend back.
 * Social debt: do you accept, refuse, or formalise the pressure before it owns you?
 */
const scene: Scene = {
  id: "debt-called-in",
  title: "A Debt Called In",
  type: "shop",
  description:
    "The stablehand returns with a cousin who can bring paying customers, if you will quietly supply one restricted tonic tonight.",
  availability: {
    all: [
      { kind: "day", min: 4 },
      { kind: "property", entityId: "story", property: "stablehand_helped", value: true }
    ]
  },
  startBeatId: "returned-favour",
  beats: {
    "returned-favour": {
      id: "returned-favour",
      title: "Gratitude With Terms",
      text:
        "The stablehand returns with a cousin and a proposition. Paying customers could come your way, if one restricted tonic leaves quietly tonight.",
      choices: [
        {
          id: "accept-favour",
          label: "Accept the favour",
          description: "Let gratitude become a useful arrangement.",
          endsScene: true,
          effects: [
            gainPropertyAmount("shop", "coins", 6),
            spendPropertyAmount("shop", "stock", 1),
            increaseProperty("shop", "goodwill", "slightly"),
            increaseProperty("town", "gossipHeat", "moderately"),
            decreaseProperty("player", "prudence", "moderately"),
            { kind: "log", text: "The cousin pays in advance and leaves through the side door." }
          ],
          aftermath: {
            narration:
              "You accepted the arrangement. The cousin paid in advance and left through the side door, turning old gratitude into something useful and less clean.",
            spotlightProperties: [
              { entityId: "shop", property: "coins" },
              { entityId: "shop", property: "stock" },
              { entityId: "shop", property: "goodwill" },
              { entityId: "town", property: "gossipHeat" },
              { entityId: "player", property: "prudence" }
            ],
            futureEchoText: ["A kindness has become a route for pressure."]
          }
        },
        {
          id: "refuse-pressure",
          label: "Refuse the pressure gently",
          description: "Keep the old kindness from becoming a hook.",
          endsScene: true,
          effects: [
            increaseProperty("shop", "goodwill", "slightly"),
            increaseProperty("shop", "shopStanding", "slightly"),
            spendPropertyAmount("shop", "coins", 1),
            decreaseProperty("player", "ambition", "slightly"),
            { kind: "log", text: "The stablehand looks embarrassed, then relieved to still be welcome." }
          ],
          aftermath: {
            narration:
              "You refused the pressure without refusing the person. The stablehand looked embarrassed, then relieved to still be welcome.",
            spotlightProperties: [
              { entityId: "shop", property: "goodwill" },
              { entityId: "shop", property: "shopStanding" },
              { entityId: "shop", property: "coins" },
              { entityId: "player", property: "ambition" }
            ],
            futureEchoText: ["The old kindness was kept from becoming a hook."]
          }
        },
        {
          id: "write-formal-terms",
          label: "Write formal terms",
          description: "Make the favour lawful, limited, and a little cold.",
          endsScene: true,
          effects: [
            gainPropertyAmount("shop", "coins", 3),
            increaseProperty("player", "prudence", "slightly"),
            decreaseProperty("player", "compassion", "slightly"),
            increaseProperty("shop", "shopStanding", "slightly"),
            decreaseProperty("shop", "goodwill", "slightly"),
            { kind: "log", text: "The paper protects everyone and warms no one." }
          ],
          aftermath: {
            narration:
              "You wrote formal terms and made the favour lawful, limited, and cold. The paper protected everyone and warmed no one.",
            spotlightProperties: [
              { entityId: "shop", property: "coins" },
              { entityId: "player", property: "prudence" },
              { entityId: "player", property: "compassion" },
              { entityId: "shop", property: "shopStanding" },
              { entityId: "shop", property: "goodwill" }
            ],
            futureEchoText: ["The debt now has edges, ink, and less room to pretend."]
          }
        }
      ]
    }
  }
};

export default scene;
