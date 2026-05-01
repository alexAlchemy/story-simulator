import type { Effect, EffectContext, GameState } from "../domain";
import {
  adjustEntityGauge,
  adjustEntityQuantity
} from "./worldAccess";

export function applyEffects(
  state: GameState,
  effects: Effect[],
  context: EffectContext
): GameState {
  let next = cloneState(state);

  for (const effect of effects) {
    switch (effect.kind) {
      case "entityGauge":
        next = adjustEntityGauge(next, effect.entityId, effect.key, effect.delta);
        break;
      case "entityQuantity":
        next = adjustEntityQuantity(next, effect.entityId, effect.key, effect.delta);
        break;
      case "setFlag":
        next.flags[effect.key] = effect.value;
        break;
      case "addScene":
        if (
          !next.sceneTableau.includes(effect.sceneId) &&
          !next.resolvedScenes.includes(effect.sceneId)
        ) {
          next.sceneTableau = [...next.sceneTableau, effect.sceneId];
        }
        break;
      case "removeScene":
        next.sceneTableau = next.sceneTableau.filter((id) => id !== effect.sceneId);
        break;
      case "log":
        next.log = [
          ...next.log,
          {
            id: `log-${next.log.length + 1}-${context.sceneId ?? "day"}`,
            day: context.day,
            sceneId: context.sceneId,
            text: effect.text
          }
        ];
        break;
      default:
        assertNever(effect);
    }
  }

  return next;
}

function cloneState(state: GameState): GameState {
  return {
    ...state,
    world: {
      entities: Object.fromEntries(
        Object.entries(state.world.entities).map(([id, entity]) => [
          id,
          {
            ...entity,
            tags: [...entity.tags],
            gauges: { ...entity.gauges },
            quantities: { ...entity.quantities },
            flags: { ...entity.flags }
          }
        ])
      )
    },
    flags: { ...state.flags },
    sceneTableau: [...state.sceneTableau],
    resolvedScenes: [...state.resolvedScenes],
    log: [...state.log]
  };
}

function assertNever(value: never): never {
  throw new Error(`Unsupported effect: ${JSON.stringify(value)}`);
}
