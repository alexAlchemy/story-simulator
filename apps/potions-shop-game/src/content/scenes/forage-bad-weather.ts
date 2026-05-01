import type { Scene } from "@aphebis/core";
import { decreaseProperty, gainPropertyAmount, increaseProperty } from "@aphebis/system-cosy-shop";

/**
 * PREMISE: The shelves are thin and the marsh path is slick with rain—but mooncap mushrooms bloom.
 * A test of resource hunger: how much of tomorrow's strength do you burn to ease today's shortage?
 */
const scene: Scene = {
  id: "forage-bad-weather",
  title: "Forage in Bad Weather",
  type: "shop",
  description:
    "The marsh path is slick, but the shelves look thin enough to make the walk tempting.",
  availability: {
    all: [
      {
        kind: "property",
        entityId: "shop",
        property: "stock",
        max: 2
      }
    ]
  },
  choices: [
    {
      id: "go-yourself",
      label: "Go yourself",
      effects: [
        gainPropertyAmount("shop", "stock", 2),
        increaseProperty("player", "fatigue", "moderately"),
        increaseProperty("player", "ambition", "slightly"),
        { kind: "log", text: "You return mud-streaked, triumphant, and more tired than you admit." }
      ]
    },
    {
      id: "send-apprentice",
      label: "Send the apprentice with instructions",
      effects: [
        gainPropertyAmount("shop", "stock", 1),
        increaseProperty("apprentice", "trust", "slightly"),
        increaseProperty("player", "prudence", "slightly"),
        { kind: "log", text: "They return soaked, proud, and carrying almost the right mushrooms." }
      ]
    },
    {
      id: "stay-in",
      label: "Stay in and preserve your strength",
      effects: [
        decreaseProperty("player", "fatigue", "slightly"),
        increaseProperty("player", "prudence", "slightly"),
        { kind: "log", text: "The shelves stay thin, but your hands stop shaking." }
      ]
    }
  ]
};

export default scene;
