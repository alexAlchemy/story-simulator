import type { GameContent } from "@aphebis/core";
import { dayPlan } from "./dayPlan";
import { scenes } from "./scenes/index";
import {
  entityGaugeDefinitions,
  relationshipDimensionDefinitions
} from "../system/semantics/definitions";

export { scenes };

export type PotionsShopContent = GameContent & {
  rentDueDay: number;
  rentAmount: number;
};

export const content: PotionsShopContent = {
  scenes,
  dayPlan,
  endDay: 5,
  semantics: {
    entityGaugeDefinitions,
    relationshipDimensionDefinitions
  },
  rentDueDay: 5,
  rentAmount: 30
};
