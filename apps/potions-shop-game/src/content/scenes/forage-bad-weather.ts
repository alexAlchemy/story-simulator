import type { SceneCard } from "@aphebis/core";
import { decreaseEntityGauge, gainQuantity, increaseEntityGauge, increaseRelationshipDimension } from "@aphebis/system-cosy-shop";

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
  availability: {
    all: [
      {
        kind: "entityQuantity",
        entityId: "shop",
        key: "stock",
        max: 2
      }
    ]
  },
  choices: [
    {
      id: "go-yourself",
      label: "Go yourself",
      effects: [
        gainQuantity("shop", "stock", 2),
        increaseEntityGauge("player", "fatigue", "moderately"),
        increaseEntityGauge("player", "ambition", "slightly"),
        { kind: "log", text: "You return mud-streaked, triumphant, and more tired than you admit." }
      ]
    },
    {
      id: "send-apprentice",
      label: "Send the apprentice with instructions",
      effects: [
        gainQuantity("shop", "stock", 1),
        increaseRelationshipDimension("apprentice->player", "trust", "slightly"),
        increaseEntityGauge("player", "prudence", "slightly"),
        { kind: "log", text: "They return soaked, proud, and carrying almost the right mushrooms." }
      ]
    },
    {
      id: "stay-in",
      label: "Stay in and preserve your strength",
      effects: [
        decreaseEntityGauge("player", "fatigue", "slightly"),
        increaseEntityGauge("player", "prudence", "slightly"),
        { kind: "log", text: "The shelves stay thin, but your hands stop shaking." }
      ]
    }
  ]
};

export default scene;
