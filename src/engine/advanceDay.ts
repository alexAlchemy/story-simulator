import type { GameContent, GameState } from "../domain/types";
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
    sceneTableau: applyClockChanges(state.sceneTableau, nextDay, content),
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

function applyClockChanges(
  sceneTableau: string[],
  day: number,
  content: GameContent
): string[] {
  const next: string[] = [];

  for (const sceneId of sceneTableau) {
    const scene = content.scenes[sceneId];
    if (!scene) {
      continue;
    }

    if (scene.clock?.expiresOnDay && day >= scene.clock.expiresOnDay) {
      continue;
    }

    if (
      scene.clock?.transformsOnDay &&
      scene.clock.transformsInto &&
      day >= scene.clock.transformsOnDay
    ) {
      if (!next.includes(scene.clock.transformsInto)) {
        next.push(scene.clock.transformsInto);
      }
      continue;
    }

    if (!next.includes(sceneId)) {
      next.push(sceneId);
    }
  }

  return next;
}
