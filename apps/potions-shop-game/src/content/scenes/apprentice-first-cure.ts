import type { Scene } from "@aphebis/core";
import { decreaseEntityGauge, decreaseRelationshipDimension, increaseEntityGauge, increaseRelationshipDimension } from "@aphebis/system-cosy-shop";

/**
 * PREMISE: A parent returns to thank the apprentice for advice that helped, but the remedy was incomplete.
 * Growth under scrutiny: do you protect confidence, accuracy, or the relationship between them?
 */
const scene: Scene = {
  id: "apprentice-first-cure",
  title: "The Apprentice's First Cure",
  type: "staff",
  description:
    "A relieved parent returns with thanks for your apprentice. The child recovered, but the dosage advice was not quite right.",
  availability: {
    all: [{ kind: "day", min: 3 }],
    any: [
      {
        kind: "relationshipDimension",
        relationshipId: "apprentice->player",
        key: "affection",
        minLabel: "Warm"
      },
      {
        kind: "relationshipDimension",
        relationshipId: "apprentice->player",
        key: "trust",
        minLabel: "Trusting"
      }
    ]
  },
  choices: [
    {
      id: "praise-in-public",
      label: "Praise them where the parent can hear",
      description: "Let the apprentice feel the warmth of a win.",
      effects: [
        increaseEntityGauge("apprentice", "confidence", "moderately"),
        increaseRelationshipDimension("apprentice->player", "affection", "moderately"),
        decreaseRelationshipDimension("apprentice->player", "fear", "slightly"),
        decreaseEntityGauge("player", "prudence", "slightly"),
        { kind: "log", text: "The apprentice stands a little taller for the rest of the afternoon." }
      ]
    },
    {
      id: "correct-privately",
      label: "Thank the parent, then correct the method privately",
      description: "Protect the truth without turning the praise sour.",
      effects: [
        increaseEntityGauge("apprentice", "confidence", "slightly"),
        increaseRelationshipDimension("apprentice->player", "trust", "slightly"),
        { kind: "log", text: "They copy the dosage note twice and keep the thank-you like a secret." }
      ]
    },
    {
      id: "make-them-explain",
      label: "Ask them to explain the mistake aloud",
      description: "Make competence public, including the rough edge.",
      effects: [
        decreaseEntityGauge("apprentice", "confidence", "slightly"),
        increaseRelationshipDimension("apprentice->player", "fear", "slightly"),
        decreaseRelationshipDimension("apprentice->player", "affection", "slightly"),
        { kind: "log", text: "The explanation is accurate, quiet, and hard for both of you." }
      ]
    }
  ]
};

export default scene;
