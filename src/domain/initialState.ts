import type { GameState } from "./types";

export function createInitialState(): GameState {
  return {
    day: 1,
    world: {
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
        "apprentice->player": {
          id: "apprentice->player",
          from: "apprentice",
          to: "player",
          dimensions: {
            trust: 0,
            affection: 0,
            fear: 0
          },
          flags: {},
          tokens: []
        },
        "town->shop": {
          id: "town->shop",
          from: "town",
          to: "shop",
          dimensions: {
            trust: 0,
            goodwill: 0
          },
          flags: {},
          tokens: []
        }
      }
    },
    flags: {},
    sceneTableau: [
      "desperate-stablehand",
      "apprentice-hiding-mistake",
      "gift-at-door"
    ],
    resolvedScenes: [],
    log: [
      {
        id: "start",
        day: 1,
        text: "Rain beads on the shop window. Rent is due in five days."
      }
    ],
    ended: false
  };
}
