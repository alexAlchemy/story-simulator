import type {
  Effect,
  EffectContext,
  EntityId,
  GameState,
  PropertyKey,
  PropertyValue
} from "../domain";
import {
  changeEntityProperty,
  getEntityProperty,
  setEntityProperty
} from "./worldAccess";

export type AppliedEffectChange =
  | {
      kind: "propertyChanged";
      entityId: EntityId;
      property: PropertyKey;
      before: PropertyValue | undefined;
      after: PropertyValue | undefined;
      effect: Effect;
    }
  | {
      kind: "sceneAdded";
      sceneId: string;
      effect: Effect;
    }
  | {
      kind: "sceneRemoved";
      sceneId: string;
      effect: Effect;
    }
  | {
      kind: "logAdded";
      text: string;
      effect: Effect;
    };

export type AppliedEffectsResult = {
  state: GameState;
  changes: AppliedEffectChange[];
};

export function applyEffects(
  state: GameState,
  effects: Effect[],
  context: EffectContext
): GameState {
  return applyEffectsWithTrace(state, effects, context).state;
}

export function applyEffectsWithTrace(
  state: GameState,
  effects: Effect[],
  context: EffectContext
): AppliedEffectsResult {
  let next = cloneState(state);
  const changes: AppliedEffectChange[] = [];

  for (const effect of effects) {
    switch (effect.kind) {
      case "changeProperty": {
        const before = getEntityProperty(next, effect.entityId, effect.property);
        next = changeEntityProperty(
          next,
          effect.entityId,
          effect.property,
          effect,
          context.propertyDefinitions?.[effect.property]
        );
        const after = getEntityProperty(next, effect.entityId, effect.property);
        if (before !== after) {
          changes.push({
            kind: "propertyChanged",
            entityId: effect.entityId,
            property: effect.property,
            before,
            after,
            effect
          });
        }
        break;
      }
      case "setProperty": {
        const before = getEntityProperty(next, effect.entityId, effect.property);
        next = setEntityProperty(next, effect.entityId, effect.property, effect.value);
        if (before !== effect.value) {
          changes.push({
            kind: "propertyChanged",
            entityId: effect.entityId,
            property: effect.property,
            before,
            after: effect.value,
            effect
          });
        }
        break;
      }
      case "addScene": {
        if (
          !next.sceneTableau.includes(effect.sceneId) &&
          !next.resolvedScenes.includes(effect.sceneId)
        ) {
          next.sceneTableau = [...next.sceneTableau, effect.sceneId];
          changes.push({ kind: "sceneAdded", sceneId: effect.sceneId, effect });
        }
        break;
      }
      case "removeScene": {
        const wasPresent = next.sceneTableau.includes(effect.sceneId);
        next.sceneTableau = next.sceneTableau.filter((id) => id !== effect.sceneId);
        if (wasPresent) {
          changes.push({ kind: "sceneRemoved", sceneId: effect.sceneId, effect });
        }
        break;
      }
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
        changes.push({ kind: "logAdded", text: effect.text, effect });
        break;
      default:
        assertNever(effect);
    }
  }

  return { state: next, changes };
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
