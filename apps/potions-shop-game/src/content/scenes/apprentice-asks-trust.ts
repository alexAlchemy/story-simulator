import type { SceneCard } from "../../domain";
import { decreaseEntityGauge, decreaseRelationshipDimension, gainQuantity, increaseEntityGauge, increaseRelationshipDimension } from "../effects";

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
        gainQuantity("shop", "coins", 5),
        decreaseEntityGauge("player", "fatigue", "slightly"),
        increaseRelationshipDimension("apprentice->player", "trust", "moderately"),
        increaseRelationshipDimension("apprentice->player", "affection", "slightly"),
        { kind: "log", text: "They mispronounce one tincture and make three honest sales anyway." }
      ]
    },
    {
      id: "supervise",
      label: "Supervise closely",
      effects: [
        gainQuantity("shop", "coins", 4),
        decreaseRelationshipDimension("apprentice->player", "trust", "slightly"),
        decreaseRelationshipDimension("apprentice->player", "affection", "slightly"),
        increaseEntityGauge("player", "prudence", "slightly"),
        { kind: "log", text: "Nothing goes wrong, which somehow proves less than either of you hoped." }
      ]
    }
  ]
};

export default scene;
