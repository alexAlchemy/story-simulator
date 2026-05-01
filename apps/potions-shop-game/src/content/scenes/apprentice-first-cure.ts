import type { Scene } from "@aphebis/core";
import { decreaseEntityGauge, increaseEntityGauge } from "@aphebis/system-cosy-shop";

/**
 * PREMISE: A parent returns to thank the apprentice for advice that helped, but the remedy was incomplete.
 * Growth under scrutiny: do you protect confidence, accuracy, or the bond between you?
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
        kind: "property",
        entityId: "apprentice",
        property: "affection",
        minLabel: "Warm"
      },
      {
        kind: "property",
        entityId: "apprentice",
        property: "trust",
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
        increaseEntityGauge("apprentice", "affection", "moderately"),
        decreaseEntityGauge("apprentice", "fear", "slightly"),
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
        increaseEntityGauge("apprentice", "trust", "slightly"),
        { kind: "log", text: "They copy the dosage note twice and keep the thank-you like a secret." }
      ]
    },
    {
      id: "make-them-explain",
      label: "Ask them to explain the mistake aloud",
      description: "Make competence public, including the rough edge.",
      effects: [
        decreaseEntityGauge("apprentice", "confidence", "slightly"),
        increaseEntityGauge("apprentice", "fear", "slightly"),
        decreaseEntityGauge("apprentice", "affection", "slightly"),
        { kind: "log", text: "The explanation is accurate, quiet, and hard for both of you." }
      ]
    }
  ]
};

export default scene;
