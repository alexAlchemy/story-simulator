import type { Scene } from "@aphebis/core";
import { decreaseProperty, increaseProperty, spendPropertyAmount } from "@aphebis/system-cosy-shop";

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
  startBeatId: "stopped-talking",
  beats: {
    "stopped-talking": {
      id: "stopped-talking",
      title: "A Story With Your Name In It",
      text:
        "The neighbours stop talking too quickly. The shop has become a story at the well, and stories grow fastest when nobody answers them directly.",
      choices: [
        {
          id: "answer-plainly",
          label: "Answer the rumours plainly",
          description: "Give the town fewer shadows to embroider.",
          endsScene: true,
          effects: [
            decreaseProperty("town", "gossipHeat", "moderately"),
            increaseProperty("shop", "shopStanding", "slightly"),
            increaseProperty("player", "fatigue", "slightly"),
            { kind: "log", text: "By noon, the story is smaller, duller, and more nearly true." }
          ],
          aftermath: {
            narration:
              "You answered plainly, and the story lost some of its appetite. By noon it was smaller, duller, and more nearly true.",
            spotlightProperties: [
              { entityId: "town", property: "gossipHeat" },
              { entityId: "shop", property: "shopStanding" },
              { entityId: "player", property: "fatigue" }
            ],
            futureEchoText: ["The town has fewer shadows to embroider, for now."]
          }
        },
        {
          id: "lean-into-mystique",
          label: "Let the mystery do its work",
          description: "A little wonder can bring customers through the door.",
          endsScene: true,
          effects: [
            increaseProperty("town", "gossipHeat", "moderately"),
            increaseProperty("player", "ambition", "slightly"),
            decreaseProperty("shop", "goodwill", "slightly"),
            { kind: "log", text: "The next customer asks whether your bottles glow when no one watches." }
          ],
          aftermath: {
            narration:
              "You let the mystery keep breathing. The next customer asked whether your bottles glow when no one watches, and sounded half hopeful.",
            spotlightProperties: [
              { entityId: "town", property: "gossipHeat" },
              { entityId: "player", property: "ambition" },
              { entityId: "shop", property: "goodwill" }
            ],
            futureEchoText: ["Wonder may bring customers in, but it rarely stays obedient."]
          }
        },
        {
          id: "ask-regular-to-speak",
          label: "Ask a regular to speak for you",
          description: "Let someone else's faith become part of the shop's voice.",
          endsScene: true,
          effects: [
            increaseProperty("shop", "goodwill", "moderately"),
            decreaseProperty("town", "gossipHeat", "slightly"),
            spendPropertyAmount("shop", "coins", 2),
            decreaseProperty("player", "ambition", "slightly"),
            { kind: "log", text: "Old Mara takes the discount and spends it loudly on your good name." }
          ],
          aftermath: {
            narration:
              "You asked Old Mara to speak for you, and gave her a discount worth making noise about. She spent it loudly on your good name.",
            spotlightProperties: [
              { entityId: "shop", property: "goodwill" },
              { entityId: "town", property: "gossipHeat" },
              { entityId: "shop", property: "coins" },
              { entityId: "player", property: "ambition" }
            ],
            futureEchoText: ["Someone else's faith has become part of the shop's voice."]
          }
        }
      ]
    }
  }
};

export default scene;
