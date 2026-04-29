import type { GameContent, GameState } from "../domain";
import { applyEffects } from "./applyEffects";
import { buildEnding } from "./buildEnding";

export function advanceDay(state: GameState, content: GameContent): GameState {
  if (state.ended) {
    return state;
  }

  if (state.day >= content.rentDueDay) {
    return {
      ...state,
      ended: true
    };
  }

  const nextDay = state.day + 1;
  let next: GameState = {
    ...state,
    day: nextDay,
    sceneTableau: [...state.sceneTableau],
    log: [
      ...state.log,
      {
        id: `day-${nextDay}`,
        day: nextDay,
        text: `Day ${nextDay} begins. The shop remembers what you chose.`
      }
    ]
  };

  for (const sceneId of content.dayPlan[nextDay] ?? []) {
    next = applyEffects(
      next,
      [{ kind: "addScene", sceneId }],
      { day: nextDay }
    );
  }

  if (nextDay === content.rentDueDay) {
    next = applyEffects(
      next,
      [{ kind: "log", text: buildEnding(next, content).shopOutcome }],
      { day: nextDay }
    );
  }

  return next;
}
