import type { Scene } from "@aphebis/core";
import { decreaseProperty, story, increaseProperty } from "@aphebis/system-cosy-shop";

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
  startBeatId: "cracked-vial",
  beats: {
    "cracked-vial": {
      id: "cracked-vial",
      title: "The Hidden Vial",
      text:
        "The cracked vial is tucked where a hurried hand hoped no one would look. Your apprentice watches you find it, face already braced for the shape of your response.",
      choices: [
        {
          id: "call-them-over",
          label: "Call them over",
          description:
            "Bring the mistake into the open before deciding whether this is carelessness, fear, or something else.",
          nextBeatId: "what-spilled"
        }
      ]
    },
    "what-spilled": {
      id: "what-spilled",
      title: "What Spilled",
      text:
        "They come close enough for you to see the red line across one thumb. The vial held calming syrup, the batch you promised to save for fever cases. They were reaching for it after a customer snapped that apprentices always know less than the jars they dust. When it cracked, they hid it before the shame could reach your face.",
      choices: [
        {
          id: "ask-gently",
          label: "Ask gently what happened",
          description:
            "Make room for the full truth, even if it costs time and leaves the broken stock on your ledger.",
          endsScene: true,
          effects: [
            increaseProperty("apprentice", "trust", "moderately"),
            increaseProperty("apprentice", "affection", "strongly"),
            story.setFact("mistake_handled_gently", true),
            increaseProperty("player", "compassion", "slightly"),
            increaseProperty("player", "fatigue", "slightly"),
            { kind: "log", text: "The story comes out slowly: fear first, then the mistake itself." }
          ],
          aftermath: {
            narration:
              "You asked softly enough that the rest of the answer had somewhere to land. The story came out in pieces: the customer, the slip, the crack, then the fear of being thought careless.",
            spotlightProperties: [
              { entityId: "apprentice", property: "trust" },
              { entityId: "apprentice", property: "affection" },
              { entityId: "player", property: "compassion" },
              { entityId: "player", property: "fatigue" },
              { entityId: "story", property: "mistake_handled_gently" }
            ],
            futureEchoText: ["Your apprentice has learned that mistakes can be brought into the open."]
          }
        },
        {
          id: "lesson",
          label: "Turn it into a lesson",
          description:
            "Keep blame small and convert the mistake into a rule the shop can actually use next time.",
          endsScene: true,
          effects: [
            increaseProperty("apprentice", "trust", "slightly"),
            increaseProperty("apprentice", "affection", "slightly"),
            increaseProperty("player", "prudence", "slightly"),
            { kind: "log", text: "You clean the glass together and write a safer shelf rule in chalk." }
          ],
          aftermath: {
            narration:
              "You kept the blame small and the lesson clear. Together you swept the glass, relabelled the shelf, and wrote a safer rule where both of you could see it.",
            spotlightProperties: [
              { entityId: "apprentice", property: "trust" },
              { entityId: "apprentice", property: "affection" },
              { entityId: "player", property: "prudence" }
            ],
            futureEchoText: ["The shop has one more rule, and the rule has a story behind it."]
          }
        },
        {
          id: "sharp-confrontation",
          label: "Confront them sharply",
          description:
            "Make hiding the mistake more serious than breaking the vial, trading warmth for immediate discipline.",
          endsScene: true,
          effects: [
            decreaseProperty("apprentice", "trust", "moderately"),
            increaseProperty("player", "ambition", "slightly"),
            decreaseProperty("player", "fatigue", "slightly"),
            { kind: "log", text: "The shop is efficient for the next hour, and painfully quiet." }
          ],
          aftermath: {
            narration:
              "You made the mistake plain and the consequence plainer. The work improved at once, but the room went quiet in the way rooms do when care has stepped back.",
            spotlightProperties: [
              { entityId: "apprentice", property: "trust" },
              { entityId: "player", property: "ambition" },
              { entityId: "player", property: "fatigue" }
            ],
            futureEchoText: ["Your apprentice will be more careful. They may also be more alone with mistakes."]
          }
        }
      ]
    }
  }
};

export default scene;
