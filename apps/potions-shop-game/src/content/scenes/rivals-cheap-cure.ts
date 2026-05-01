import type { Scene } from "@aphebis/core";
import { decreaseProperty, gainPropertyAmount, increaseProperty, spendPropertyAmount } from "@aphebis/system-cosy-shop";

/**
 * PREMISE: A rival seller offers a cheaper cure outside your door.
 * Competitive ethics: do you defend the customer, the business, or the town's freedom to choose?
 */
const scene: Scene = {
  id: "rivals-cheap-cure",
  title: "The Rival's Cheap Cure",
  type: "town",
  description:
    "A travelling seller sets up near your door with a cheaper fever cure. It may work. It may also be mostly coloured water.",
  availability: {
    all: [{ kind: "day", min: 4 }],
    any: [
      {
        kind: "property",
        entityId: "player",
        property: "ambition",
        minLabel: "Driven"
      },
      {
        kind: "property",
        entityId: "town",
        property: "gossipHeat",
        minLabel: "Buzzing"
      }
    ]
  },
  choices: [
    {
      id: "warn-honestly",
      label: "Warn customers honestly",
      description: "Name the risk without making it a duel.",
      effects: [
        increaseProperty("shop", "shopStanding", "slightly"),
        increaseProperty("shop", "goodwill", "slightly"),
        increaseProperty("town", "gossipHeat", "slightly"),
        spendPropertyAmount("shop", "coins", 2),
        { kind: "log", text: "Some listen. Some resent listening. No one can say you lied." }
      ]
    },
    {
      id: "undercut-rival",
      label: "Undercut the rival for one afternoon",
      description: "Win the crowd before the crowd decides what is true.",
      effects: [
        gainPropertyAmount("shop", "coins", 4),
        spendPropertyAmount("shop", "stock", 2),
        increaseProperty("player", "ambition", "moderately"),
        decreaseProperty("player", "compassion", "slightly"),
        increaseProperty("town", "gossipHeat", "moderately"),
        { kind: "log", text: "By dusk, the rival is gone and the town is full of comparisons." }
      ]
    },
    {
      id: "let-town-choose",
      label: "Let the town choose",
      description: "Refuse to turn the street into a trial.",
      effects: [
        decreaseProperty("player", "prudence", "slightly"),
        decreaseProperty("shop", "goodwill", "slightly"),
        increaseProperty("town", "gossipHeat", "slightly"),
        { kind: "log", text: "The street makes its own judgement, as streets always do." }
      ]
    }
  ]
};

export default scene;
