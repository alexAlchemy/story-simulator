import type { SceneCard } from "../../domain/types";
import { decreaseEntityGauge, decreaseRelationshipDimension, increaseEntityGauge, increaseRelationshipDimension } from "../effects";

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
  choices: [
    {
      id: "ask-gently",
      label: "Ask gently what happened",
      effects: [
        increaseRelationshipDimension("apprentice->player", "trust", "moderately"),
        increaseRelationshipDimension("apprentice->player", "affection", "strongly"),
        {
          kind: "addRelationshipToken",
          relationshipId: "apprentice->player",
          token: {
            id: "mistake-handled-gently",
            kind: "promise",
            label: "Mistakes can be admitted",
            description: "The apprentice has seen that honesty is not always punished.",
            sourceSceneId: "apprentice-hiding-mistake"
          }
        },
        increaseEntityGauge("player", "compassion", "slightly"),
        increaseEntityGauge("player", "fatigue", "slightly"),
        { kind: "log", text: "The story comes out slowly: fear first, then the mistake itself." }
      ]
    },
    {
      id: "lesson",
      label: "Turn it into a lesson",
      effects: [
        increaseRelationshipDimension("apprentice->player", "trust", "slightly"),
        increaseRelationshipDimension("apprentice->player", "affection", "slightly"),
        increaseEntityGauge("player", "prudence", "slightly"),
        { kind: "log", text: "You clean the glass together and write a safer shelf rule in chalk." }
      ]
    },
    {
      id: "sharp-confrontation",
      label: "Confront them sharply",
      effects: [
        decreaseRelationshipDimension("apprentice->player", "trust", "moderately"),
        increaseEntityGauge("player", "ambition", "slightly"),
        decreaseEntityGauge("player", "fatigue", "slightly"),
        { kind: "log", text: "The shop is efficient for the next hour, and painfully quiet." }
      ]
    }
  ]
};

export default scene;
