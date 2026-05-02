import type { Scene } from "@aphebis/core";
import { decreaseProperty, gainPropertyAmount, increaseProperty, spendPropertyAmount } from "@aphebis/system-cosy-shop";

/**
 * PREMISE: A rival seller offers a cheaper cure outside your door.
 * Competitive ethics: do you defend the customer, the business, or the town's freedom to choose?
 */
const scene: Scene = {
  id: "rivals-cheap-cure",
  title: "The Rival's Cheap Cure",
  type: "town",
  description:
    "A travelling seller sets up near your door with a cheaper fever cure. It may work. It may also be mostly coloured water.",
  availability: {
    all: [{ kind: "day", min: 4 }],
    any: [
      {
        kind: "property",
        entityId: "player",
        property: "ambition",
        minLabel: "Driven"
      },
      {
        kind: "property",
        entityId: "town",
        property: "gossipHeat",
        minLabel: "Buzzing"
      }
    ]
  },
  startBeatId: "seller-outside",
  beats: {
    "seller-outside": {
      id: "seller-outside",
      title: "Cheaper Fever Cure",
      text:
        "The travelling seller's sign is bright, cheap, and placed close enough to your door to feel deliberate. Their cure may work. It may also be mostly coloured water.",
      choices: [
        {
          id: "listen-to-pitch",
          label: "Listen to the pitch",
          description:
            "Learn exactly what the rival is promising before you answer in public.",
          nextBeatId: "crowd-compares"
        },
        {
          id: "inspect-a-bottle",
          label: "Inspect one of their bottles",
          description:
            "Look for evidence while the crowd watches how fair you are willing to be.",
          nextBeatId: "crowd-compares"
        },
        {
          id: "count-your-stock",
          label: "Count what you can spare",
          description:
            "Check whether defending the shop could become a price war you can actually survive.",
          nextBeatId: "crowd-compares"
        }
      ]
    },
    "crowd-compares": {
      id: "crowd-compares",
      title: "The Crowd Compares",
      text:
        "The rival promises fast relief for half your price. The liquid is thin but not obviously false, and the first customers are already comparing your window to their sign.",
      choices: [
        {
          id: "warn-honestly",
          label: "Warn customers honestly",
          description: "Name the risk without making it a duel.",
          endsScene: true,
          effects: [
            increaseProperty("shop", "shopStanding", "slightly"),
            increaseProperty("shop", "goodwill", "slightly"),
            increaseProperty("town", "gossipHeat", "slightly"),
            spendPropertyAmount("shop", "coins", 2),
            { kind: "log", text: "Some listen. Some resent listening. No one can say you lied." }
          ],
          aftermath: {
            narration:
              "You warned customers honestly and kept the warning from becoming a duel. Some listened, some resented listening, and no one could say you lied.",
            spotlightProperties: [
              { entityId: "shop", property: "shopStanding" },
              { entityId: "shop", property: "goodwill" },
              { entityId: "town", property: "gossipHeat" },
              { entityId: "shop", property: "coins" }
            ],
            futureEchoText: ["The town heard you choose accuracy over spectacle."]
          }
        },
        {
          id: "undercut-rival",
          label: "Undercut the rival for one afternoon",
          description: "Win the crowd before the crowd decides what is true.",
          endsScene: true,
          effects: [
            gainPropertyAmount("shop", "coins", 4),
            spendPropertyAmount("shop", "stock", 2),
            increaseProperty("player", "ambition", "moderately"),
            decreaseProperty("player", "compassion", "slightly"),
            increaseProperty("town", "gossipHeat", "moderately"),
            { kind: "log", text: "By dusk, the rival is gone and the town is full of comparisons." }
          ],
          aftermath: {
            narration:
              "You undercut the rival before the crowd could settle. By dusk, the seller was gone and the town was full of comparisons.",
            spotlightProperties: [
              { entityId: "shop", property: "coins" },
              { entityId: "shop", property: "stock" },
              { entityId: "player", property: "ambition" },
              { entityId: "player", property: "compassion" },
              { entityId: "town", property: "gossipHeat" }
            ],
            futureEchoText: ["The street learned that your shop can compete when cornered."]
          }
        },
        {
          id: "let-town-choose",
          label: "Let the town choose",
          description: "Refuse to turn the street into a trial.",
          endsScene: true,
          effects: [
            decreaseProperty("player", "prudence", "slightly"),
            decreaseProperty("shop", "goodwill", "slightly"),
            increaseProperty("town", "gossipHeat", "slightly"),
            { kind: "log", text: "The street makes its own judgement, as streets always do." }
          ],
          aftermath: {
            narration:
              "You refused to turn the street into a trial. The crowd made its own judgement, as crowds do, and the seller kept calling out prices.",
            spotlightProperties: [
              { entityId: "player", property: "prudence" },
              { entityId: "shop", property: "goodwill" },
              { entityId: "town", property: "gossipHeat" }
            ],
            futureEchoText: ["The town was left to choose, and to own what it chose."]
          }
        }
      ]
    }
  }
};

export default scene;
