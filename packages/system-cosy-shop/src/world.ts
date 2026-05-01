import type { WorldState } from "@aphebis/core";

export function createCosyShopWorld(): WorldState {
  return {
    entities: {
      player: {
        id: "player",
        kind: "person",
        displayName: "The Shopkeeper",
        tags: ["protagonist", "shopkeeper"],
        properties: {
          fatigue: 0,
          compassion: 0,
          prudence: 0,
          ambition: 0
        },
      },
      shop: {
        id: "shop",
        kind: "shop",
        displayName: "The Potion Shop",
        tags: ["business", "apothecary"],
        properties: {
          shopStanding: 0,
          goodwill: 0,
          coins: 18,
          stock: 3
        }
      },
      apprentice: {
        id: "apprentice",
        kind: "person",
        displayName: "The Apprentice",
        tags: ["staff", "apprentice"],
        properties: {
          confidence: 0.35,
          trust: 0,
          affection: 0,
          fear: 0
        }
      },
      town: {
        id: "town",
        kind: "group",
        displayName: "Briarwick",
        tags: ["community", "market"],
        properties: {
          gossipHeat: 0.2
        }
      },
      story: {
        id: "story",
        kind: "story",
        displayName: "Story Facts",
        tags: ["system"],
        properties: {}
      }
    }
  };
}
