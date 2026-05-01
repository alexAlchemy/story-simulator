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
  choices: [
    {
      id: "accept-favour",
      label: "Accept the favour",
      description: "Let gratitude become a useful arrangement.",
      effects: [
        gainPropertyAmount("shop", "coins", 6),
        spendPropertyAmount("shop", "stock", 1),
        increaseProperty("shop", "goodwill", "slightly"),
        increaseProperty("town", "gossipHeat", "moderately"),
        decreaseProperty("player", "prudence", "moderately"),
        { kind: "log", text: "The cousin pays in advance and leaves through the side door." }
      ]
    },
    {
      id: "refuse-pressure",
      label: "Refuse the pressure gently",
      description: "Keep the old kindness from becoming a hook.",
      effects: [
        increaseProperty("shop", "goodwill", "slightly"),
        increaseProperty("shop", "shopStanding", "slightly"),
        spendPropertyAmount("shop", "coins", 1),
        decreaseProperty("player", "ambition", "slightly"),
        { kind: "log", text: "The stablehand looks embarrassed, then relieved to still be welcome." }
      ]
    },
    {
      id: "write-formal-terms",
      label: "Write formal terms",
      description: "Make the favour lawful, limited, and a little cold.",
      effects: [
        gainPropertyAmount("shop", "coins", 3),
        increaseProperty("player", "prudence", "slightly"),
        decreaseProperty("player", "compassion", "slightly"),
        increaseProperty("shop", "shopStanding", "slightly"),
        decreaseProperty("shop", "goodwill", "slightly"),
        { kind: "log", text: "The paper protects everyone and warms no one." }
      ]
    }
  ]
};

export default scene;
