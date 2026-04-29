import type { SceneCard } from "../../domain/types";
import apprenticeAsksTrust from "./apprentice-asks-trust";
import apprenticeHidingMistake from "./apprentice-hiding-mistake";
import countingCoins from "./counting-coins";
import desperateStablehand from "./desperate-stablehand";
import forageBadWeather from "./forage-bad-weather";
import giftAtDoor from "./gift-at-door";
import giftGiverRevealed from "./gift-giver-revealed";
import moonTonicOrder from "./moon-tonic-order";
import nobleRushOrder from "./noble-rush-order";
import quietRepairSign from "./quiet-repair-sign";
import raisePrices from "./raise-prices";
import regularNotOkay from "./regular-not-okay";
import rentComesDue from "./rent-comes-due";
import rumourAtMarket from "./rumour-at-market";
import staffBurnout from "./staff-burnout";
import supplierCheapStock from "./supplier-cheap-stock";
import templeHealerVisits from "./temple-healer-visits";

const sceneList: SceneCard[] = [
  desperateStablehand,
  moonTonicOrder,
  apprenticeHidingMistake,
  giftAtDoor,
  countingCoins,
  templeHealerVisits,
  rumourAtMarket,
  forageBadWeather,
  apprenticeAsksTrust,
  nobleRushOrder,
  supplierCheapStock,
  quietRepairSign,
  regularNotOkay,
  raisePrices,
  staffBurnout,
  giftGiverRevealed,
  rentComesDue
];

export const scenes: Record<string, SceneCard> = Object.fromEntries(sceneList.map((scene) => [scene.id, scene]));

export {
  apprenticeAsksTrust,
  apprenticeHidingMistake,
  countingCoins,
  desperateStablehand,
  forageBadWeather,
  giftAtDoor,
  giftGiverRevealed,
  moonTonicOrder,
  nobleRushOrder,
  quietRepairSign,
  raisePrices,
  regularNotOkay,
  rentComesDue,
  rumourAtMarket,
  staffBurnout,
  supplierCheapStock,
  templeHealerVisits
};
