import type { SceneCard } from "../../domain/types";
import apprenticeAsksTrust from "./apprentice-asks-trust";
import apprenticeHidingMistake from "./apprentice-hiding-mistake";
import countingCoins from "./counting-coins";
import desperateStablehand from "./desperate-stablehand";
import forageBadWeather from "./forage-bad-weather";
import giftAtDoor from "./gift-at-door";
import giftGiverRevealed from "./gift-giver-revealed";

const sceneList: SceneCard[] = [
  desperateStablehand,
  apprenticeHidingMistake,
  giftAtDoor,
  countingCoins,
  forageBadWeather,
  apprenticeAsksTrust,
  giftGiverRevealed
];

export const scenes: Record<string, SceneCard> = Object.fromEntries(sceneList.map((scene) => [scene.id, scene]));

export {
  apprenticeAsksTrust,
  apprenticeHidingMistake,
  countingCoins,
  desperateStablehand,
  forageBadWeather,
  giftAtDoor,
  giftGiverRevealed
};
