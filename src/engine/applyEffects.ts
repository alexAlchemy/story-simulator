import type { Effect, EffectContext, GameState } from "../domain/types";

const CLAMPED_RESOURCES = new Set(["coins", "stock", "fatigue"]);

export function applyEffects(
  state: GameState,
  effects: Effect[],
  context: EffectContext
): GameState {
  let next = cloneState(state);

  for (const effect of effects) {
    switch (effect.kind) {
      case "resource": {
        const rawValue = next.resources[effect.key] + effect.delta;
        next.resources[effect.key] = CLAMPED_RESOURCES.has(effect.key)
          ? Math.max(0, rawValue)
          : rawValue;
        break;
      }
      case "value":
        next.values[effect.key] += effect.delta;
        break;
      case "relationship":
        next.relationships[effect.key] += effect.delta;
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
    resources: { ...state.resources },
    values: { ...state.values },
    relationships: { ...state.relationships },
    flags: { ...state.flags },
    sceneTableau: [...state.sceneTableau],
    resolvedScenes: [...state.resolvedScenes],
    log: [...state.log]
  };
}

function assertNever(value: never): never {
  throw new Error(`Unsupported effect: ${JSON.stringify(value)}`);
}
