import type { GameState } from "./types";

export function createInitialState(): GameState {
  return {
    day: 1,
    resources: {
      coins: 18,
      stock: 3,
      fatigue: 0
    },
    values: {
      compassion: 0,
      prudence: 0,
      ambition: 0
    },
    relationships: {
      apprenticeTrust: 0,
      townTrust: 0
    },
    flags: {},
    sceneTableau: [
      "desperate-stablehand",
      "moon-tonic-order",
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
