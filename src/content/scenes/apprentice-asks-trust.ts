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
  coreQuestion: "Do you make room for someone else to become capable?",
  boons: [{ label: "They know the regulars by name." }],
  banes: [{ label: "One bad sale could cost more than time." }],
  choices: [
    {
      id: "trust-counter",
      label: "Trust them with the counter",
      effects: [
        { kind: "resource", key: "coins", delta: 5 },
        { kind: "resource", key: "fatigue", delta: -1 },
        { kind: "relationship", key: "apprenticeTrust", delta: 2 },
        { kind: "log", text: "They mispronounce one tincture and make three honest sales anyway." }
      ]
    },
    {
      id: "supervise",
      label: "Supervise closely",
      effects: [
        { kind: "resource", key: "coins", delta: 4 },
        { kind: "relationship", key: "apprenticeTrust", delta: -1 },
        { kind: "value", key: "prudence", delta: 1 },
        { kind: "log", text: "Nothing goes wrong, which somehow proves less than either of you hoped." }
      ]
    }
  ]
};

export default scene;
