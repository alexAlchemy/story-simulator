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
  startBeatId: "rain-path",
  beats: {
    "rain-path": {
      id: "rain-path",
      title: "The Marsh Path",
      text:
        "The shelves are thin, and the marsh path is shining with rain. Mooncap mushrooms bloom best in this weather, which feels like an accusation.",
      choices: [
        {
          id: "check-shelf-gaps",
          label: "Check which shelves are bare",
          description:
            "Measure the shortage before deciding whether the rain is worth answering.",
          nextBeatId: "weather-deepens"
        },
        {
          id: "watch-the-path",
          label: "Watch the marsh path from the door",
          description:
            "Let the weather show its teeth before you choose who, if anyone, should go.",
          nextBeatId: "weather-deepens"
        },
        {
          id: "ask-apprentice-readiness",
          label: "Ask if the apprentice knows mooncap",
          description:
            "Find out whether this can become training or whether the risk still belongs to you.",
          nextBeatId: "weather-deepens"
        }
      ]
    },
    "weather-deepens": {
      id: "weather-deepens",
      title: "Weather Taking Its Due",
      text:
        "A cart wheel slips in the lane outside. The apprentice names mooncap's silver gills correctly, then hesitates over the poisonous lookalike. The shelves behind you answer with their own thin silence.",
      choices: [
        {
          id: "go-yourself",
          label: "Go yourself",
          description:
            "Spend your own strength to bring back the most stock and keep the dangerous lesson off someone else's shoulders.",
          endsScene: true,
          effects: [
            gainPropertyAmount("shop", "stock", 2),
            increaseProperty("player", "fatigue", "moderately"),
            increaseProperty("player", "ambition", "slightly"),
            { kind: "log", text: "You return mud-streaked, triumphant, and more tired than you admit." }
          ],
          aftermath: {
            narration:
              "You took the marsh path yourself and came back mud-streaked, triumphant, and colder than you meant to admit.",
            spotlightProperties: [
              { entityId: "shop", property: "stock" },
              { entityId: "player", property: "fatigue" },
              { entityId: "player", property: "ambition" }
            ],
            futureEchoText: ["Today's shortage is eased, but the weather took its due."]
          }
        },
        {
          id: "send-apprentice",
          label: "Send the apprentice with instructions",
          description:
            "Accept a smaller haul and some risk so the apprentice learns the work beyond the counter.",
          endsScene: true,
          effects: [
            gainPropertyAmount("shop", "stock", 1),
            increaseProperty("apprentice", "trust", "slightly"),
            increaseProperty("player", "prudence", "slightly"),
            { kind: "log", text: "They return soaked, proud, and carrying almost the right mushrooms." }
          ],
          aftermath: {
            narration:
              "You gave careful instructions and let your apprentice take the path. They returned soaked, proud, and carrying almost the right mushrooms.",
            spotlightProperties: [
              { entityId: "shop", property: "stock" },
              { entityId: "apprentice", property: "trust" },
              { entityId: "player", property: "prudence" }
            ],
            futureEchoText: ["Delegation has made the shop a little less dependent on your own hands."]
          }
        },
        {
          id: "stay-in",
          label: "Stay in and preserve your strength",
          description:
            "Leave the shelves thin rather than turn bad weather into another debt your body must pay.",
          endsScene: true,
          effects: [
            decreaseProperty("player", "fatigue", "slightly"),
            increaseProperty("player", "prudence", "slightly"),
            { kind: "log", text: "The shelves stay thin, but your hands stop shaking." }
          ],
          aftermath: {
            narration:
              "You watched the rain and stayed inside. The shelves remained thin, but your hands stopped shaking before the next customer arrived.",
            spotlightProperties: [
              { entityId: "player", property: "fatigue" },
              { entityId: "player", property: "prudence" }
            ],
            futureEchoText: ["The stock problem remains, but you did not spend tomorrow's strength today."]
          }
        }
      ]
    }
  }
};

export default scene;
