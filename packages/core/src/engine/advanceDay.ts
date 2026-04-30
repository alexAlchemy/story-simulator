import type { GameContent, GameState } from "../domain";
import { applyEffects } from "./applyEffects";

export function advanceDay(state: GameState, content: GameContent): GameState {
  if (state.ended) {
    return state;
  }

  if (state.day >= content.endDay) {
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
        text: `Day ${nextDay} begins.`
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
  return next;
}
