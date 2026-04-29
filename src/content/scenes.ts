import type { GameContent } from "../domain";
import { dayPlan } from "./dayPlan";
import { scenes } from "./scenes/index";

export { scenes };

export const content: GameContent = {
  scenes,
  dayPlan,
  rentDueDay: 5,
  rentAmount: 30
};
