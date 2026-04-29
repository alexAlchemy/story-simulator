import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: Your apprentice asks to handle the front counter alone while you work the back room.
 * A test of delegation: do you make room for someone else to become capable, or protect the till?
 */
const scene: SceneCard = {
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
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: 5 },
        { kind: "entityGauge", entityId: "player", key: "fatigue", delta: -0.1 },
        {
          kind: "relationshipDimension",
          relationshipId: "apprentice->player",
          key: "trust",
          delta: 0.2
        },
        { kind: "log", text: "They mispronounce one tincture and make three honest sales anyway." }
      ]
    },
    {
      id: "supervise",
      label: "Supervise closely",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: 4 },
        {
          kind: "relationshipDimension",
          relationshipId: "apprentice->player",
          key: "trust",
          delta: -0.1
        },
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: 0.1 },
        { kind: "log", text: "Nothing goes wrong, which somehow proves less than either of you hoped." }
      ]
    }
  ]
};

export default scene;
