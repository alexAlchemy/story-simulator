import type { GameState } from "@aphebis/core";
import { createCosyShopWorld } from "@aphebis/system-cosy-shop";

export function createInitialState(): GameState {
  return {
    day: 1,
    world: createCosyShopWorld(),
    flags: {},
    sceneTableau: [
      "desperate-stablehand",
      "apprentice-hiding-mistake",
      "gift-at-door",
      "after-hours-tea"
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
