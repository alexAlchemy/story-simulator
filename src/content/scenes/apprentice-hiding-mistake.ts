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
        {
          kind: "relationshipDimension",
          relationshipId: "apprentice->player",
          key: "trust",
          delta: 0.2
        },
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
        { kind: "entityGauge", entityId: "player", key: "compassion", delta: 0.1 },
        { kind: "entityGauge", entityId: "player", key: "fatigue", delta: 0.1 },
        { kind: "log", text: "The story comes out slowly: fear first, then the mistake itself." }
      ]
    },
    {
      id: "lesson",
      label: "Turn it into a lesson",
      effects: [
        {
          kind: "relationshipDimension",
          relationshipId: "apprentice->player",
          key: "trust",
          delta: 0.1
        },
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: 0.1 },
        { kind: "log", text: "You clean the glass together and write a safer shelf rule in chalk." }
      ]
    },
    {
      id: "sharp-confrontation",
      label: "Confront them sharply",
      effects: [
        {
          kind: "relationshipDimension",
          relationshipId: "apprentice->player",
          key: "trust",
          delta: -0.2
        },
        { kind: "entityGauge", entityId: "player", key: "ambition", delta: 0.1 },
        { kind: "entityGauge", entityId: "player", key: "fatigue", delta: -0.1 },
        { kind: "log", text: "The shop is efficient for the next hour, and painfully quiet." }
      ]
    }
  ]
};

export default scene;
