import type { SceneCard } from "../../domain/types";

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
  choices: [
    {
      id: "warn-honestly",
      label: "Warn customers honestly",
      description: "Name the risk without making it a duel.",
      effects: [
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: 0.1
        },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "goodwill",
          delta: 0.1
        },
        { kind: "entityGauge", entityId: "town", key: "gossipHeat", delta: 0.1 },
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: -2 },
        { kind: "log", text: "Some listen. Some resent listening. No one can say you lied." }
      ]
    },
    {
      id: "undercut-rival",
      label: "Undercut the rival for one afternoon",
      description: "Win the crowd before the crowd decides what is true.",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: 4 },
        { kind: "entityQuantity", entityId: "shop", key: "stock", delta: -2 },
        { kind: "entityGauge", entityId: "player", key: "ambition", delta: 0.2 },
        { kind: "entityGauge", entityId: "player", key: "compassion", delta: -0.1 },
        { kind: "entityGauge", entityId: "town", key: "gossipHeat", delta: 0.2 },
        { kind: "log", text: "By dusk, the rival is gone and the town is full of comparisons." }
      ]
    },
    {
      id: "let-town-choose",
      label: "Let the town choose",
      description: "Refuse to turn the street into a trial.",
      effects: [
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: -0.1 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "goodwill",
          delta: -0.1
        },
        { kind: "entityGauge", entityId: "town", key: "gossipHeat", delta: 0.1 },
        { kind: "log", text: "The street makes its own judgement, as streets always do." }
      ]
    }
  ]
};

export default scene;
