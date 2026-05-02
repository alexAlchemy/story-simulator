import type { Effect, EffectContext, GameState } from "../domain";
import {
  changeEntityProperty,
  setEntityProperty
} from "./worldAccess";

export function applyEffects(
  state: GameState,
  effects: Effect[],
  context: EffectContext
): GameState {
  let next = cloneState(state);

  for (const effect of effects) {
    switch (effect.kind) {
      case "changeProperty":
        next = changeEntityProperty(
          next,
          effect.entityId,
          effect.property,
          effect,
          context.propertyDefinitions?.[effect.property]
        );
        break;
      case "setProperty":
        next = setEntityProperty(next, effect.entityId, effect.property, effect.value);
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
            properties: { ...entity.properties }
          }
        ])
      )
    },
    sceneTableau: [...state.sceneTableau],
    activeScene: state.activeScene
      ? {
          ...state.activeScene,
          localState: { ...state.activeScene.localState },
          choicesMade: [...state.activeScene.choicesMade]
        }
      : undefined,
    resolvedScenes: [...state.resolvedScenes],
    log: [...state.log]
  };
}

function assertNever(value: never): never {
  throw new Error(`Unsupported effect: ${JSON.stringify(value)}`);
}
