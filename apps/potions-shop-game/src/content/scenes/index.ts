import type { Scene } from "@aphebis/core";
import apprenticeBreaksRule from "./apprentice-breaks-rule";
import apprenticeAsksTrust from "./apprentice-asks-trust";
import apprenticeFirstCure from "./apprentice-first-cure";
import apprenticeHidingMistake from "./apprentice-hiding-mistake";
import afterHoursTea from "./after-hours-tea";
import countingCoins from "./counting-coins";
import debtCalledIn from "./debt-called-in";
import desperateStablehand from "./desperate-stablehand";
import familiarCustomer from "./familiar-customer";
import forageBadWeather from "./forage-bad-weather";
import giftAtDoor from "./gift-at-door";
import giftGiverRevealed from "./gift-giver-revealed";
import rivalsCheapCure from "./rivals-cheap-cure";
import rumourAtWell from "./rumour-at-well";

const sceneList: Scene[] = [
  desperateStablehand,
  apprenticeHidingMistake,
  giftAtDoor,
  afterHoursTea,
  countingCoins,
  forageBadWeather,
  apprenticeAsksTrust,
  giftGiverRevealed,
  apprenticeFirstCure,
  rumourAtWell,
  apprenticeBreaksRule,
  familiarCustomer,
  rivalsCheapCure,
  debtCalledIn
];

export const scenes: Record<string, Scene> = Object.fromEntries(sceneList.map((scene) => [scene.id, scene]));

export {
  apprenticeBreaksRule,
  apprenticeAsksTrust,
  apprenticeFirstCure,
  apprenticeHidingMistake,
  afterHoursTea,
  countingCoins,
  debtCalledIn,
  desperateStablehand,
  familiarCustomer,
  forageBadWeather,
  giftAtDoor,
  giftGiverRevealed,
  rivalsCheapCure,
  rumourAtWell
};
