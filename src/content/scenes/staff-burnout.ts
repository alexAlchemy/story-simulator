import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: Your apprentice drops a tray, apologizes three times, and looks ready to vanish.
 * A reckoning: is the shop worth saving if it teaches people to disappear inside it?
 */
const scene: SceneCard = {
  id: "staff-burnout",
  title: "Staff Burnout",
  type: "staff",
  description:
    "Your apprentice drops a tray, apologizes three times, and looks ready to disappear into the floorboards.",
  coreQuestion: "Is the shop worth saving if it teaches people to vanish inside it?",
  boons: [{ label: "You can still change the rhythm of the day." }],
  banes: [{ label: "Rent is tomorrow." }],
  choices: [
    {
      id: "close-early",
      label: "Close early and make tea",
      effects: [
        { kind: "resource", key: "fatigue", delta: -2 },
        { kind: "relationship", key: "apprenticeTrust", delta: 2 },
        { kind: "value", key: "compassion", delta: 1 },
        {
          kind: "log",
          text: "You lose an hour of trade and gain a conversation that should have happened sooner."
        }
      ]
    },
    {
      id: "push-through",
      label: "Push through until closing",
      effects: [
        { kind: "resource", key: "coins", delta: 6 },
        { kind: "relationship", key: "apprenticeTrust", delta: -2 },
        { kind: "value", key: "ambition", delta: 1 },
        { kind: "log", text: "The drawer is heavier. So is the silence." }
      ]
    }
  ]
};

export default scene;
