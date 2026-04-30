import type { SceneCard } from "@aphebis/core";
import { decreaseEntityGauge, decreaseRelationshipDimension, increaseEntityGauge, increaseRelationshipDimension, spendQuantity } from "../effects";

/**
 * PREMISE: The apprentice gives away a minor potion without asking.
 * Kindness strains the shop rules: what kind of person are you teaching them to become?
 */
const scene: SceneCard = {
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
        spendQuantity("shop", "stock", 1),
        increaseEntityGauge("player", "compassion", "moderately"),
        decreaseEntityGauge("player", "prudence", "slightly"),
        increaseRelationshipDimension("apprentice->player", "affection", "moderately"),
        decreaseRelationshipDimension("apprentice->player", "fear", "slightly"),
        { kind: "log", text: "Their relief is too bright to look at directly." }
      ]
    },
    {
      id: "discipline-clearly",
      label: "Discipline them clearly",
      description: "A shop cannot run on surprise mercy.",
      effects: [
        decreaseEntityGauge("apprentice", "confidence", "slightly"),
        increaseRelationshipDimension("apprentice->player", "fear", "moderately"),
        decreaseRelationshipDimension("apprentice->player", "affection", "slightly"),
        increaseEntityGauge("player", "prudence", "moderately"),
        decreaseEntityGauge("player", "compassion", "slightly"),
        { kind: "log", text: "They nod at every rule and touch nothing without asking all morning." }
      ]
    },
    {
      id: "write-mercy-rule",
      label: "Write a mercy rule for small remedies",
      description: "Turn a mistake into a boundary both of you can stand inside.",
      effects: [
        spendQuantity("shop", "coins", 1),
        increaseEntityGauge("apprentice", "confidence", "moderately"),
        increaseRelationshipDimension("apprentice->player", "trust", "slightly"),
        increaseRelationshipDimension("town->shop", "goodwill", "slightly"),
        { kind: "log", text: "The new chalk rule is short, strict, and somehow gentle." }
      ]
    }
  ]
};

export default scene;
