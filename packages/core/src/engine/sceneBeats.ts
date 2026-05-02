import type {
  ActiveSceneSession,
  BeatChoice,
  LocalAvailability,
  LocalCondition,
  LocalEffect,
  LocalStateValue,
  Scene,
  SceneChoice,
  SceneLocalProperty
} from "../domain";

export function isBeatScene(scene: Scene): boolean {
  return Boolean(scene.beats && scene.startBeatId);
}

export function createActiveSceneSession(scene: Scene): ActiveSceneSession {
  if (!scene.startBeatId) {
    throw new Error(`Scene "${scene.id}" does not define a start beat`);
  }

  return {
    sceneId: scene.id,
    currentBeatId: scene.startBeatId,
    localState: Object.fromEntries(
      Object.entries(scene.localProperties ?? {}).map(([key, property]) => [
        key,
        property.initial
      ])
    ),
    choicesMade: []
  };
}

export function getCurrentBeat(scene: Scene, session?: ActiveSceneSession) {
  if (!scene.beats) {
    return null;
  }

  const beatId = session?.sceneId === scene.id ? session.currentBeatId : scene.startBeatId;
  if (!beatId) {
    return null;
  }

  return scene.beats[beatId] ?? null;
}

export function getAvailableBeatChoices(
  choices: BeatChoice[],
  localState: Record<string, LocalStateValue>
): BeatChoice[] {
  return choices.filter((choice) => canUseLocalAvailability(choice.availability, localState));
}

export function getSceneChoices(scene: Scene, session?: ActiveSceneSession): Array<SceneChoice | BeatChoice> {
  if (!isBeatScene(scene)) {
    return scene.choices ?? [];
  }

  const beat = getCurrentBeat(scene, session);
  if (!beat) {
    return [];
  }

  const localState =
    session?.sceneId === scene.id ? session.localState : createActiveSceneSession(scene).localState;
  return getAvailableBeatChoices(beat.choices, localState);
}

export function getAllSceneChoices(scene: Scene): Array<SceneChoice | BeatChoice> {
  if (!isBeatScene(scene)) {
    return scene.choices ?? [];
  }

  return Object.values(scene.beats ?? {}).flatMap((beat) => beat.choices);
}

export function applyLocalEffects(
  localState: Record<string, LocalStateValue>,
  effects: LocalEffect[] = [],
  definitions: Scene["localProperties"] = {}
): Record<string, LocalStateValue> {
  const next = { ...localState };

  for (const effect of effects) {
    switch (effect.kind) {
      case "setLocal":
        next[effect.key] = effect.value;
        break;
      case "changeLocal":
        next[effect.key] = clampLocalNumber(
          Number(next[effect.key] ?? 0) + effect.delta,
          definitions[effect.key]
        );
        break;
      default:
        assertNever(effect);
    }
  }

  return next;
}

function canUseLocalAvailability(
  availability: LocalAvailability | undefined,
  localState: Record<string, LocalStateValue>
): boolean {
  if (!availability) {
    return true;
  }

  const matchesAll = availability.all?.every((condition) =>
    matchesLocalCondition(condition, localState)
  );
  const matchesAny = availability.any?.some((condition) =>
    matchesLocalCondition(condition, localState)
  );

  return (matchesAll ?? true) && (matchesAny ?? true);
}

function matchesLocalCondition(
  condition: LocalCondition,
  localState: Record<string, LocalStateValue>
): boolean {
  const value = localState[condition.key];

  if (condition.present !== undefined && (value !== undefined) !== condition.present) {
    return false;
  }

  if (condition.equals !== undefined && value !== condition.equals) {
    return false;
  }

  if (condition.min !== undefined && (typeof value !== "number" || value < condition.min)) {
    return false;
  }

  if (condition.max !== undefined && (typeof value !== "number" || value > condition.max)) {
    return false;
  }

  return true;
}

function clampLocalNumber(value: number, definition: SceneLocalProperty | undefined) {
  return Math.min(definition?.max ?? value, Math.max(definition?.min ?? value, value));
}

function assertNever(value: never): never {
  throw new Error(`Unsupported local effect: ${JSON.stringify(value)}`);
}
