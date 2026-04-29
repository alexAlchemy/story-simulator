import type { SceneCard } from "../../domain/types";

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
        { kind: "entityQuantity", entityId: "shop", key: "stock", delta: -1 },
        { kind: "entityGauge", entityId: "player", key: "compassion", delta: 0.2 },
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: -0.1 },
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
        { kind: "log", text: "Their relief is too bright to look at directly." }
      ]
    },
    {
      id: "discipline-clearly",
      label: "Discipline them clearly",
      description: "A shop cannot run on surprise mercy.",
      effects: [
        { kind: "entityGauge", entityId: "apprentice", key: "confidence", delta: -0.1 },
        {
          kind: "relationshipDimension",
          relationshipId: "apprentice->player",
          key: "fear",
          delta: 0.2
        },
        {
          kind: "relationshipDimension",
          relationshipId: "apprentice->player",
          key: "affection",
          delta: -0.1
        },
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: 0.2 },
        { kind: "entityGauge", entityId: "player", key: "compassion", delta: -0.1 },
        { kind: "log", text: "They nod at every rule and touch nothing without asking all morning." }
      ]
    },
    {
      id: "write-mercy-rule",
      label: "Write a mercy rule for small remedies",
      description: "Turn a mistake into a boundary both of you can stand inside.",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: -1 },
        { kind: "entityGauge", entityId: "apprentice", key: "confidence", delta: 0.2 },
        {
          kind: "relationshipDimension",
          relationshipId: "apprentice->player",
          key: "trust",
          delta: 0.1
        },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "goodwill",
          delta: 0.1
        },
        { kind: "log", text: "The new chalk rule is short, strict, and somehow gentle." }
      ]
    }
  ]
};

export default scene;
