import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: The landlord's bell sounds at noon. The week has become a number, but not only a number.
 * The final reckoning: what did the shop survive as, and who did you become to keep it open?
 */
const scene: SceneCard = {
  id: "rent-comes-due",
  title: "Rent Comes Due",
  type: "shop",
  description:
    "The landlord's bell sounds at noon. The week has become a number, but not only a number.",
  coreQuestion: "What did the shop survive as?",
  boons: [{ label: "Every prior choice is already in the room." }],
  banes: [{ label: "Thirty coins are due today." }],
  choices: [
    {
      id: "pay-or-negotiate",
      label: "Open the ledger",
      description: "Face the final accounting.",
      effects: [
        { kind: "log", text: "You turn the ledger around and see the week written in coin, trust, and tired ink." }
      ]
    },
    {
      id: "look-around",
      label: "Look around the shop first",
      description: "Notice who you became before the bell finishes ringing.",
      effects: [
        { kind: "value", key: "compassion", delta: 0 },
        { kind: "log", text: "The bottles, broom, counter, and apprentice all seem to be waiting with you." }
      ]
    }
  ]
};

export default scene;
