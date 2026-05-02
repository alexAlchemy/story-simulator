import type { Scene } from "@aphebis/core";
import {
  decreaseProperty,
  increaseProperty,
  spendPropertyAmount
} from "@aphebis/system-cosy-shop";

/**
 * PREMISE: The apprentice lingers after closing with a cup of tea and too much on their mind.
 * The player is bribed, deflected, or invited in: what kind of closeness do you allow?
 */
const scene: Scene = {
  id: "after-hours-tea",
  title: "After-Hours Tea",
  type: "staff",
  description:
    "The shop is shut, but the apprentice stays by the counter with a cooling cup of tea and an unfinished thought.",
  startBeatId: "cooling-tea",
  beats: {
    "cooling-tea": {
      id: "cooling-tea",
      title: "The Unfinished Thought",
      text:
        "The apprentice turns the cup between both hands. Whatever they meant to say has waited through sweeping, shutters, and the first long quiet after closing.",
      choices: [
        {
          id: "sit-beside-them",
          label: "Sit beside them at the counter",
          description:
            "Make the quiet less formal before deciding how much of the evening you can give.",
          nextBeatId: "what-they-ask"
        },
        {
          id: "keep-sorting",
          label: "Keep sorting bottles while they speak",
          description:
            "Leave the door open for conversation without fully stepping away from the work.",
          nextBeatId: "what-they-ask"
        },
        {
          id: "ask-if-urgent",
          label: "Ask if this needs tonight",
          description:
            "Find out whether the unfinished thought is a wound, a worry, or a need for company.",
          nextBeatId: "what-they-ask"
        }
      ]
    },
    "what-they-ask": {
      id: "what-they-ask",
      title: "What They Ask",
      text:
        "At first it is only a story from before they came to the shop: a room where they were always corrected before they were heard. Then they look down at the tea and ask whether mistakes feel smaller after a person has somewhere to belong.",
      choices: [
        {
          id: "listen-closely",
          label: "Listen to the whole story",
          description: "Give the moment its full attention.",
          endsScene: true,
          effects: [
            increaseProperty("apprentice", "affection", "strongly"),
            increaseProperty("apprentice", "affection", "moderately"),
            increaseProperty("apprentice", "trust", "moderately"),
            decreaseProperty("player", "fatigue", "slightly"),
            { kind: "log", text: "The story is ordinary, except for the part where it makes the room feel safer." }
          ],
          aftermath: {
            narration:
              "You let the evening stretch around their story. It was ordinary in its details, but not in the way the room changed once they had been heard.",
            spotlightProperties: [
              { entityId: "apprentice", property: "affection" },
              { entityId: "apprentice", property: "trust" },
              { entityId: "player", property: "fatigue" }
            ],
            futureEchoText: ["After tonight, the counter may feel less like a place to hide."]
          }
        },
        {
          id: "redirect-to-work",
          label: "Deflect back to the work",
          description: "Keep the evening practical and a little distant.",
          endsScene: true,
          effects: [
            increaseProperty("player", "prudence", "slightly"),
            increaseProperty("apprentice", "trust", "slightly"),
            decreaseProperty("apprentice", "affection", "slightly"),
            { kind: "log", text: "You talk shelf order until the story loses some of its heat." }
          ],
          aftermath: {
            narration:
              "You moved the conversation back to shelf order and tomorrow's work. The unfinished thought cooled with the tea, still present but easier to shelve.",
            spotlightProperties: [
              { entityId: "player", property: "prudence" },
              { entityId: "apprentice", property: "trust" },
              { entityId: "apprentice", property: "affection" }
            ],
            futureEchoText: ["The work stayed orderly. The invitation did not quite disappear."]
          }
        },
        {
          id: "buy-quiet",
          label: "Buy them a pastry and ask for silence",
          description: "Pay a small cost to avoid the moment without quite refusing it.",
          endsScene: true,
          effects: [
            spendPropertyAmount("shop", "coins", 2),
            increaseProperty("apprentice", "affection", "slightly"),
            increaseProperty("player", "compassion", "slightly"),
            { kind: "log", text: "The pastry works. So does the silence, though only for tonight." }
          ],
          aftermath: {
            narration:
              "You bought sweetness and a little room to breathe. The pastry worked, and so did the silence, though both felt temporary.",
            spotlightProperties: [
              { entityId: "shop", property: "coins" },
              { entityId: "apprentice", property: "affection" },
              { entityId: "player", property: "compassion" }
            ],
            futureEchoText: ["The kindness was real, even if the question was postponed."]
          }
        }
      ]
    }
  }
};

export default scene;
