import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: The shelves are thin and the marsh path is slick with rain—but mooncap mushrooms bloom.
 * A test of resource hunger: how much of tomorrow's strength do you burn to ease today's shortage?
 */
const scene: SceneCard = {
  id: "forage-bad-weather",
  title: "Forage in Bad Weather",
  type: "shop",
  description:
    "The marsh path is slick, but the shelves look thin enough to make the walk tempting.",
  coreQuestion: "How much of tomorrow's strength do you spend on today's shortage?",
  boons: [{ label: "Mooncap mushrooms bloom after rain." }],
  banes: [{ label: "A bad fall could ruin the day." }],
  choices: [
    {
      id: "go-yourself",
      label: "Go yourself",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "stock", delta: 2 },
        { kind: "entityGauge", entityId: "player", key: "fatigue", delta: 0.2 },
        { kind: "entityGauge", entityId: "player", key: "ambition", delta: 0.1 },
        { kind: "log", text: "You return mud-streaked, triumphant, and more tired than you admit." }
      ]
    },
    {
      id: "send-apprentice",
      label: "Send the apprentice with instructions",
      effects: [
        { kind: "entityQuantity", entityId: "shop", key: "stock", delta: 1 },
        {
          kind: "relationshipDimension",
          relationshipId: "apprentice->player",
          key: "trust",
          delta: 0.1
        },
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: 0.1 },
        { kind: "log", text: "They return soaked, proud, and carrying almost the right mushrooms." }
      ]
    },
    {
      id: "stay-in",
      label: "Stay in and preserve your strength",
      effects: [
        { kind: "entityGauge", entityId: "player", key: "fatigue", delta: -0.1 },
        { kind: "entityGauge", entityId: "player", key: "prudence", delta: 0.1 },
        { kind: "log", text: "The shelves stay thin, but your hands stop shaking." }
      ]
    }
  ]
};

export default scene;
