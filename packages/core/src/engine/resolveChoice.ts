import type { GameContent, GameState } from "../domain";
import { applyEffects } from "./applyEffects";
import { canSeeScene } from "./sceneAvailability";
import {
  applyLocalEffects,
  createActiveSceneSession,
  getAvailableBeatChoices,
  getCurrentBeat,
  isBeatScene
} from "./sceneBeats";

export function resolveChoice(
  state: GameState,
  sceneId: string,
  choiceId: string,
  content: GameContent
): GameState {
  if (state.ended) {
    return state;
  }

  const scene = content.scenes[sceneId];
  if (!scene) {
    throw new Error(`Unknown scene id: ${sceneId}`);
  }

  if (!state.sceneTableau.includes(sceneId)) {
    throw new Error(`Scene is not currently available: ${sceneId}`);
  }

  if (!canSeeScene(scene, state, content)) {
    throw new Error(`Scene is not currently available: ${sceneId}`);
  }

  if (state.activeScene && state.activeScene.sceneId !== sceneId) {
    throw new Error(`Scene "${state.activeScene.sceneId}" is already active`);
  }

  if (isBeatScene(scene)) {
    return resolveBeatChoice(state, sceneId, choiceId, content);
  }

  const choice = (scene.choices ?? []).find((candidate) => candidate.id === choiceId);
  if (!choice) {
    throw new Error(`Unknown choice id "${choiceId}" for scene "${sceneId}"`);
  }

  const withEffects = applyEffects(state, choice.effects, {
    day: state.day,
    sceneId,
    propertyDefinitions: content.semantics?.propertyDefinitions
  });

  const followUpLog = choice.followUpText
    ? applyEffects(
        withEffects,
        [{ kind: "log", text: choice.followUpText }],
        { day: state.day, sceneId, propertyDefinitions: content.semantics?.propertyDefinitions }
      )
    : withEffects;

  return {
    ...followUpLog,
    sceneTableau: followUpLog.sceneTableau.filter((id) => id !== sceneId),
    resolvedScenes: followUpLog.resolvedScenes.includes(sceneId)
      ? followUpLog.resolvedScenes
      : [...followUpLog.resolvedScenes, sceneId]
  };
}

function resolveBeatChoice(
  state: GameState,
  sceneId: string,
  choiceId: string,
  content: GameContent
): GameState {
  const scene = content.scenes[sceneId];
  const existingSession = state.activeScene;

  if (existingSession && existingSession.sceneId !== sceneId) {
    throw new Error(`Scene "${existingSession.sceneId}" is already active`);
  }

  const session = existingSession ?? createActiveSceneSession(scene);
  const beat = getCurrentBeat(scene, session);
  if (!beat) {
    throw new Error(`Unknown beat "${session.currentBeatId}" for scene "${sceneId}"`);
  }

  const choice = getAvailableBeatChoices(beat.choices, session.localState).find(
    (candidate) => candidate.id === choiceId
  );
  if (!choice) {
    throw new Error(`Unknown choice id "${choiceId}" for scene "${sceneId}"`);
  }

  const localState = applyLocalEffects(
    session.localState,
    choice.localEffects,
    scene.localProperties
  );
  const choicesMade = [...session.choicesMade, choice.id];

  const withSession: GameState = {
    ...state,
    activeScene: {
      sceneId,
      currentBeatId: session.currentBeatId,
      localState,
      choicesMade
    }
  };

  const withEffects = applyEffects(withSession, choice.effects ?? [], {
    day: state.day,
    sceneId,
    propertyDefinitions: content.semantics?.propertyDefinitions
  });

  const followUpLog = choice.followUpText
    ? applyEffects(
        withEffects,
        [{ kind: "log", text: choice.followUpText }],
        { day: state.day, sceneId, propertyDefinitions: content.semantics?.propertyDefinitions }
      )
    : withEffects;

  if (!choice.endsScene && choice.nextBeatId) {
    if (!scene.beats?.[choice.nextBeatId]) {
      throw new Error(`Unknown next beat "${choice.nextBeatId}" for scene "${sceneId}"`);
    }

    return {
      ...followUpLog,
      activeScene: {
        sceneId,
        currentBeatId: choice.nextBeatId,
        localState,
        choicesMade
      }
    };
  }

  return {
    ...followUpLog,
    activeScene: undefined,
    sceneTableau: followUpLog.sceneTableau.filter((id) => id !== sceneId),
    resolvedScenes: followUpLog.resolvedScenes.includes(sceneId)
      ? followUpLog.resolvedScenes
      : [...followUpLog.resolvedScenes, sceneId]
  };
}
