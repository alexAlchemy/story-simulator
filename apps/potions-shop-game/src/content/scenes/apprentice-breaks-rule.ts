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
  choices: [
    {
      id: "defend-kindness",
      label: "Defend the act",
      description: "Let them know the impulse was not wrong.",
      effects: [
        spendPropertyAmount("shop", "stock", 1),
        increaseProperty("player", "compassion", "moderately"),
        decreaseProperty("player", "prudence", "slightly"),
        increaseProperty("apprentice", "affection", "moderately"),
        decreaseProperty("apprentice", "fear", "slightly"),
        { kind: "log", text: "Their relief is too bright to look at directly." }
      ]
    },
    {
      id: "discipline-clearly",
      label: "Discipline them clearly",
      description: "A shop cannot run on surprise mercy.",
      effects: [
        decreaseProperty("apprentice", "confidence", "slightly"),
        increaseProperty("apprentice", "fear", "moderately"),
        decreaseProperty("apprentice", "affection", "slightly"),
        increaseProperty("player", "prudence", "moderately"),
        decreaseProperty("player", "compassion", "slightly"),
        { kind: "log", text: "They nod at every rule and touch nothing without asking all morning." }
      ]
    },
    {
      id: "write-mercy-rule",
      label: "Write a mercy rule for small remedies",
      description: "Turn a mistake into a boundary both of you can stand inside.",
      effects: [
        spendPropertyAmount("shop", "coins", 1),
        increaseProperty("apprentice", "confidence", "moderately"),
        increaseProperty("apprentice", "trust", "slightly"),
        increaseProperty("shop", "goodwill", "slightly"),
        { kind: "log", text: "The new chalk rule is short, strict, and somehow gentle." }
      ]
    }
  ]
};

export default scene;
