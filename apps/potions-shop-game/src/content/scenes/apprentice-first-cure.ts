import type { Scene } from "@aphebis/core";
import { decreaseProperty, increaseProperty } from "@aphebis/system-cosy-shop";

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
  startBeatId: "returned-parent",
  beats: {
    "returned-parent": {
      id: "returned-parent",
      title: "Thanks and a Rough Edge",
      text:
        "The parent is grateful, the child recovered, and the apprentice is glowing. You also know the dosage advice was not quite right.",
      choices: [
        {
          id: "praise-in-public",
          label: "Praise them where the parent can hear",
          description: "Let the apprentice feel the warmth of a win.",
          endsScene: true,
          effects: [
            increaseProperty("apprentice", "confidence", "moderately"),
            increaseProperty("apprentice", "affection", "moderately"),
            decreaseProperty("apprentice", "fear", "slightly"),
            decreaseProperty("player", "prudence", "slightly"),
            { kind: "log", text: "The apprentice stands a little taller for the rest of the afternoon." }
          ],
          aftermath: {
            narration:
              "You praised them where the parent could hear. The apprentice stood a little taller for the rest of the afternoon, carrying the win more than the warning.",
            spotlightProperties: [
              { entityId: "apprentice", property: "confidence" },
              { entityId: "apprentice", property: "affection" },
              { entityId: "apprentice", property: "fear" },
              { entityId: "player", property: "prudence" }
            ],
            futureEchoText: ["A first success has been allowed to feel like success."]
          }
        },
        {
          id: "correct-privately",
          label: "Thank the parent, then correct the method privately",
          description: "Protect the truth without turning the praise sour.",
          endsScene: true,
          effects: [
            increaseProperty("apprentice", "confidence", "slightly"),
            increaseProperty("apprentice", "trust", "slightly"),
            { kind: "log", text: "They copy the dosage note twice and keep the thank-you like a secret." }
          ],
          aftermath: {
            narration:
              "You thanked the parent warmly, then corrected the method once the door had closed. The apprentice copied the dosage note twice and kept the thank-you like a secret.",
            spotlightProperties: [
              { entityId: "apprentice", property: "confidence" },
              { entityId: "apprentice", property: "trust" }
            ],
            futureEchoText: ["They learned that accuracy can sit beside pride, not only after it."]
          }
        },
        {
          id: "make-them-explain",
          label: "Ask them to explain the mistake aloud",
          description: "Make competence public, including the rough edge.",
          endsScene: true,
          effects: [
            decreaseProperty("apprentice", "confidence", "slightly"),
            increaseProperty("apprentice", "fear", "slightly"),
            decreaseProperty("apprentice", "affection", "slightly"),
            { kind: "log", text: "The explanation is accurate, quiet, and hard for both of you." }
          ],
          aftermath: {
            narration:
              "You asked them to explain the mistake aloud. The explanation was accurate, quiet, and hard for both of you.",
            spotlightProperties: [
              { entityId: "apprentice", property: "confidence" },
              { entityId: "apprentice", property: "fear" },
              { entityId: "apprentice", property: "affection" }
            ],
            futureEchoText: ["Competence was made public, including the part that stung."]
          }
        }
      ]
    }
  }
};

export default scene;
