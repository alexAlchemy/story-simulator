import type { WorldState } from "@aphebis/core";
import { relationshipId } from "@aphebis/core";

export function createCosyShopWorld(): WorldState {
  const apprenticeToPlayer = relationshipId("apprentice", "player");
  const townToShop = relationshipId("town", "shop");

  return {
    entities: {
      player: {
        id: "player",
        kind: "person",
        displayName: "The Shopkeeper",
        tags: ["protagonist", "shopkeeper"],
        gauges: {
          fatigue: 0,
          compassion: 0,
          prudence: 0,
          ambition: 0
        },
        gaugeRanges: {
          compassion: { minimumValue: -1, maximumValue: 1 },
          prudence: { minimumValue: -1, maximumValue: 1 },
          ambition: { minimumValue: -1, maximumValue: 1 }
        },
        quantities: {},
        flags: {}
      },
      shop: {
        id: "shop",
        kind: "shop",
        displayName: "The Potion Shop",
        tags: ["business", "apothecary"],
        gauges: {},
        quantities: {
          coins: 18,
          stock: 3
        },
        flags: {}
      },
      apprentice: {
        id: "apprentice",
        kind: "person",
        displayName: "The Apprentice",
        tags: ["staff", "apprentice"],
        gauges: {
          confidence: 0.35
        },
        quantities: {},
        flags: {}
      },
      town: {
        id: "town",
        kind: "group",
        displayName: "Briarwick",
        tags: ["community", "market"],
        gauges: {
          gossipHeat: 0.2
        },
        quantities: {},
        flags: {}
      }
    },
    relationships: {
      [apprenticeToPlayer]: {
        id: apprenticeToPlayer,
        from: "apprentice",
        to: "player",
        dimensions: {
          trust: 0,
          affection: 0,
          fear: 0
        },
        flags: {}
      },
      [townToShop]: {
        id: townToShop,
        from: "town",
        to: "shop",
        dimensions: {
          trust: 0,
          goodwill: 0
        },
        flags: {}
      }
    }
  };
}
