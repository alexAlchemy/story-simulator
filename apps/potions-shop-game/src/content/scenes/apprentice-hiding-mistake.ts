import type { Scene } from "@aphebis/core";
import { decreaseEntityGauge, flags, increaseEntityGauge } from "@aphebis/system-cosy-shop";

/**
 * PREMISE: You discover your apprentice has hidden a mistake—a cracked vial in the back shelf.
 * A mirror for your leadership: are you a mentor, a manager, or just too tired to be either?
 */
const scene: Scene = {
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
        increaseEntityGauge("apprentice", "trust", "moderately"),
        increaseEntityGauge("apprentice", "affection", "strongly"),
        flags.set("mistake_handled_gently", true),
        increaseEntityGauge("player", "compassion", "slightly"),
        increaseEntityGauge("player", "fatigue", "slightly"),
        { kind: "log", text: "The story comes out slowly: fear first, then the mistake itself." }
      ]
    },
    {
      id: "lesson",
      label: "Turn it into a lesson",
      effects: [
        increaseEntityGauge("apprentice", "trust", "slightly"),
        increaseEntityGauge("apprentice", "affection", "slightly"),
        increaseEntityGauge("player", "prudence", "slightly"),
        { kind: "log", text: "You clean the glass together and write a safer shelf rule in chalk." }
      ]
    },
    {
      id: "sharp-confrontation",
      label: "Confront them sharply",
      effects: [
        decreaseEntityGauge("apprentice", "trust", "moderately"),
        increaseEntityGauge("player", "ambition", "slightly"),
        decreaseEntityGauge("player", "fatigue", "slightly"),
        { kind: "log", text: "The shop is efficient for the next hour, and painfully quiet." }
      ]
    }
  ]
};

export default scene;
