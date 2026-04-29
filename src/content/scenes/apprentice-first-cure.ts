import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: A parent returns to thank the apprentice for advice that helped, but the remedy was incomplete.
 * Growth under scrutiny: do you protect confidence, accuracy, or the relationship between them?
 */
const scene: SceneCard = {
  id: "apprentice-first-cure",
  title: "The Apprentice's First Cure",
  type: "staff",
  description:
    "A relieved parent returns with thanks for your apprentice. The child recovered, but the dosage advice was not quite right.",
  choices: [
    {
      id: "praise-in-public",
      label: "Praise them where the parent can hear",
      description: "Let the apprentice feel the warmth of a win.",
      effects: [
        { kind: "entityGauge", entityId: "apprentice", key: "confidence", delta: 0.2 },
        {
          kind: "relationshipDimension",
          relationshipId: "apprentice->player",
          key: "affection",
          delta: 0.2
        },
        {
          kind: "relationshipDimension",
          relationshipId: "apprentice->player",
          key: "fear",
          delta: -0.1
        },
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: -0.1 },
        { kind: "log", text: "The apprentice stands a little taller for the rest of the afternoon." }
      ]
    },
    {
      id: "correct-privately",
      label: "Thank the parent, then correct the method privately",
      description: "Protect the truth without turning the praise sour.",
      effects: [
        { kind: "entityGauge", entityId: "apprentice", key: "confidence", delta: 0.1 },
        {
          kind: "relationshipDimension",
          relationshipId: "apprentice->player",
          key: "trust",
          delta: 0.1
        },
        { kind: "log", text: "They copy the dosage note twice and keep the thank-you like a secret." }
      ]
    },
    {
      id: "make-them-explain",
      label: "Ask them to explain the mistake aloud",
      description: "Make competence public, including the rough edge.",
      effects: [
        { kind: "entityGauge", entityId: "apprentice", key: "confidence", delta: -0.1 },
        {
          kind: "relationshipDimension",
          relationshipId: "apprentice->player",
          key: "fear",
          delta: 0.1
        },
        {
          kind: "relationshipDimension",
          relationshipId: "apprentice->player",
          key: "affection",
          delta: -0.1
        },
        { kind: "log", text: "The explanation is accurate, quiet, and hard for both of you." }
      ]
    }
  ]
};

export default scene;
