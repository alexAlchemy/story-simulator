import type { Scene } from "@aphebis/core";
import { decreaseProperty, increaseProperty, spendPropertyAmount } from "@aphebis/system-cosy-shop";

/**
 * PREMISE: The apprentice gives away a minor potion without asking.
 * Kindness strains the shop rules: what kind of person are you teaching them to become?
 */
const scene: Scene = {
  id: "apprentice-breaks-rule",
  title: "The Apprentice Breaks a Rule",
  type: "staff",
  description:
    "While you are busy, the apprentice gives a cough draught to a child whose mother cannot pay. The bottle was small. The rule was not.",
  startBeatId: "small-bottle",
  beats: {
    "small-bottle": {
      id: "small-bottle",
      title: "The Bottle Was Small",
      text:
        "The apprentice admits it before you ask. A cough draught went to a child whose mother could not pay. The bottle was small. The rule was not.",
      choices: [
        {
          id: "defend-kindness",
          label: "Defend the act",
          description: "Let them know the impulse was not wrong.",
          endsScene: true,
          effects: [
            spendPropertyAmount("shop", "stock", 1),
            increaseProperty("player", "compassion", "moderately"),
            decreaseProperty("player", "prudence", "slightly"),
            increaseProperty("apprentice", "affection", "moderately"),
            decreaseProperty("apprentice", "fear", "slightly"),
            { kind: "log", text: "Their relief is too bright to look at directly." }
          ],
          aftermath: {
            narration:
              "You defended the kindness before you addressed the rule. Their relief was too bright to look at directly, and the missing bottle stayed missing.",
            spotlightProperties: [
              { entityId: "shop", property: "stock" },
              { entityId: "player", property: "compassion" },
              { entityId: "player", property: "prudence" },
              { entityId: "apprentice", property: "affection" },
              { entityId: "apprentice", property: "fear" }
            ],
            futureEchoText: ["They will remember that mercy was not named as the mistake."]
          }
        },
        {
          id: "discipline-clearly",
          label: "Discipline them clearly",
          description: "A shop cannot run on surprise mercy.",
          endsScene: true,
          effects: [
            decreaseProperty("apprentice", "confidence", "slightly"),
            increaseProperty("apprentice", "fear", "moderately"),
            decreaseProperty("apprentice", "affection", "slightly"),
            increaseProperty("player", "prudence", "moderately"),
            decreaseProperty("player", "compassion", "slightly"),
            { kind: "log", text: "They nod at every rule and touch nothing without asking all morning." }
          ],
          aftermath: {
            narration:
              "You disciplined them clearly. They nodded at every rule and touched nothing without asking for the rest of the morning.",
            spotlightProperties: [
              { entityId: "apprentice", property: "confidence" },
              { entityId: "apprentice", property: "fear" },
              { entityId: "apprentice", property: "affection" },
              { entityId: "player", property: "prudence" },
              { entityId: "player", property: "compassion" }
            ],
            futureEchoText: ["The rule is safer now. So is the distance around it."]
          }
        },
        {
          id: "write-mercy-rule",
          label: "Write a mercy rule for small remedies",
          description: "Turn a mistake into a boundary both of you can stand inside.",
          endsScene: true,
          effects: [
            spendPropertyAmount("shop", "coins", 1),
            increaseProperty("apprentice", "confidence", "moderately"),
            increaseProperty("apprentice", "trust", "slightly"),
            increaseProperty("shop", "goodwill", "slightly"),
            { kind: "log", text: "The new chalk rule is short, strict, and somehow gentle." }
          ],
          aftermath: {
            narration:
              "You wrote a mercy rule for small remedies, short enough for the chalkboard and strict enough to hold. The boundary felt less like a wall once it had a door.",
            spotlightProperties: [
              { entityId: "shop", property: "coins" },
              { entityId: "apprentice", property: "confidence" },
              { entityId: "apprentice", property: "trust" },
              { entityId: "shop", property: "goodwill" }
            ],
            futureEchoText: ["The shop now has a way to make mercy legible."]
          }
        }
      ]
    }
  }
};

export default scene;
