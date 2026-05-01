import type { Scene } from "@aphebis/core";
import { decreaseEntityGauge, increaseEntityGauge, spendQuantity } from "@aphebis/system-cosy-shop";

/**
 * PREMISE: The town has started explaining your shop to itself.
 * Reputation pressure: do you quiet the story, use it, or ask the town to carry some of it for you?
 */
const scene: Scene = {
  id: "rumour-at-well",
  title: "Rumour at the Well",
  type: "town",
  description:
    "At the well, two neighbours stop talking when they see you. The shop has become a story, and nobody agrees what kind.",
  choices: [
    {
      id: "answer-plainly",
      label: "Answer the rumours plainly",
      description: "Give the town fewer shadows to embroider.",
      effects: [
        decreaseEntityGauge("town", "gossipHeat", "moderately"),
        increaseEntityGauge("shop", "shopStanding", "slightly"),
        increaseEntityGauge("player", "fatigue", "slightly"),
        { kind: "log", text: "By noon, the story is smaller, duller, and more nearly true." }
      ]
    },
    {
      id: "lean-into-mystique",
      label: "Let the mystery do its work",
      description: "A little wonder can bring customers through the door.",
      effects: [
        increaseEntityGauge("town", "gossipHeat", "moderately"),
        increaseEntityGauge("player", "ambition", "slightly"),
        decreaseEntityGauge("shop", "goodwill", "slightly"),
        { kind: "log", text: "The next customer asks whether your bottles glow when no one watches." }
      ]
    },
    {
      id: "ask-regular-to-speak",
      label: "Ask a regular to speak for you",
      description: "Let someone else's faith become part of the shop's voice.",
      effects: [
        increaseEntityGauge("shop", "goodwill", "moderately"),
        decreaseEntityGauge("town", "gossipHeat", "slightly"),
        spendQuantity("shop", "coins", 2),
        decreaseEntityGauge("player", "ambition", "slightly"),
        { kind: "log", text: "Old Mara takes the discount and spends it loudly on your good name." }
      ]
    }
  ]
};

export default scene;
