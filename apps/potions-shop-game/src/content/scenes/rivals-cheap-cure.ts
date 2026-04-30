import type { SceneCard } from "@aphebis/core";
import { decreaseEntityGauge, decreaseRelationshipDimension, gainQuantity, increaseEntityGauge, increaseRelationshipDimension, spendQuantity } from "@aphebis/system-cosy-shop";

/**
 * PREMISE: A rival seller offers a cheaper cure outside your door.
 * Competitive ethics: do you defend the customer, the business, or the town's freedom to choose?
 */
const scene: SceneCard = {
  id: "rivals-cheap-cure",
  title: "The Rival's Cheap Cure",
  type: "town",
  description:
    "A travelling seller sets up near your door with a cheaper fever cure. It may work. It may also be mostly coloured water.",
  availability: {
    all: [{ kind: "day", min: 4 }],
    any: [
      {
        kind: "entityGauge",
        entityId: "player",
        key: "ambition",
        minLabel: "Driven"
      },
      {
        kind: "entityGauge",
        entityId: "town",
        key: "gossipHeat",
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
        increaseRelationshipDimension("town->shop", "trust", "slightly"),
        increaseRelationshipDimension("town->shop", "goodwill", "slightly"),
        increaseEntityGauge("town", "gossipHeat", "slightly"),
        spendQuantity("shop", "coins", 2),
        { kind: "log", text: "Some listen. Some resent listening. No one can say you lied." }
      ]
    },
    {
      id: "undercut-rival",
      label: "Undercut the rival for one afternoon",
      description: "Win the crowd before the crowd decides what is true.",
      effects: [
        gainQuantity("shop", "coins", 4),
        spendQuantity("shop", "stock", 2),
        increaseEntityGauge("player", "ambition", "moderately"),
        decreaseEntityGauge("player", "compassion", "slightly"),
        increaseEntityGauge("town", "gossipHeat", "moderately"),
        { kind: "log", text: "By dusk, the rival is gone and the town is full of comparisons." }
      ]
    },
    {
      id: "let-town-choose",
      label: "Let the town choose",
      description: "Refuse to turn the street into a trial.",
      effects: [
        decreaseEntityGauge("player", "prudence", "slightly"),
        decreaseRelationshipDimension("town->shop", "goodwill", "slightly"),
        increaseEntityGauge("town", "gossipHeat", "slightly"),
        { kind: "log", text: "The street makes its own judgement, as streets always do." }
      ]
    }
  ]
};

export default scene;
