import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: You discover your apprentice has hidden a mistake—a cracked vial in the back shelf.
 * A mirror for your leadership: are you a mentor, a manager, or just too tired to be either?
 */
const scene: SceneCard = {
  id: "apprentice-hiding-mistake",
  title: "Apprentice Hiding a Mistake",
  type: "staff",
  description:
    "You find a cracked vial tucked behind the lower shelf. The label is in your apprentice's handwriting.",
  coreQuestion: "Are you a mentor, a manager, or someone too exhausted to be either?",
  boons: [{ label: "You noticed before anyone was hurt." }],
  banes: [{ label: "The apprentice has been quiet all morning." }],
  choices: [
    {
      id: "ask-gently",
      label: "Ask gently what happened",
      effects: [
        { kind: "relationship", key: "apprenticeTrust", delta: 2 },
        { kind: "value", key: "compassion", delta: 1 },
        { kind: "resource", key: "fatigue", delta: 1 },
        { kind: "log", text: "The story comes out slowly: fear first, then the mistake itself." }
      ]
    },
    {
      id: "lesson",
      label: "Turn it into a lesson",
      effects: [
        { kind: "relationship", key: "apprenticeTrust", delta: 1 },
        { kind: "value", key: "prudence", delta: 1 },
        { kind: "log", text: "You clean the glass together and write a safer shelf rule in chalk." }
      ]
    },
    {
      id: "sharp-confrontation",
      label: "Confront them sharply",
      effects: [
        { kind: "relationship", key: "apprenticeTrust", delta: -2 },
        { kind: "value", key: "ambition", delta: 1 },
        { kind: "resource", key: "fatigue", delta: -1 },
        { kind: "log", text: "The shop is efficient for the next hour, and painfully quiet." }
      ]
    }
  ]
};

export default scene;
