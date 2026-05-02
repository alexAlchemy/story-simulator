import type { GameContent, GameState } from "../domain";
import type { SceneAftermathViewModel } from "../domain";
import { applyEffects, applyEffectsWithTrace } from "./applyEffects";
import { canSeeScene } from "./sceneAvailability";
import { buildSceneAftermath } from "./sceneAftermath";
import {
  applyLocalEffects,
  createActiveSceneSession,
  getAvailableBeatChoices,
  getCurrentBeat,
  isBeatScene
} from "./sceneBeats";

export type ChoiceResolutionOutcome = {
  state: GameState;
  aftermath?: SceneAftermathViewModel;
};

export function resolveChoice(
  state: GameState,
  sceneId: string,
  choiceId: string,
  content: GameContent
): GameState {
  return resolveChoiceWithOutcome(state, sceneId, choiceId, content).state;
}

export function resolveChoiceWithOutcome(
  state: GameState,
  sceneId: string,
  choiceId: string,
  content: GameContent
): ChoiceResolutionOutcome {
  if (state.ended) {
    return { state };
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
    state: {
      ...followUpLog,
      sceneTableau: followUpLog.sceneTableau.filter((id) => id !== sceneId),
      resolvedScenes: followUpLog.resolvedScenes.includes(sceneId)
        ? followUpLog.resolvedScenes
        : [...followUpLog.resolvedScenes, sceneId]
    }
  };
}

function resolveBeatChoice(
  state: GameState,
  sceneId: string,
  choiceId: string,
  content: GameContent
): ChoiceResolutionOutcome {
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

  const appliedEffects = applyEffectsWithTrace(withSession, choice.effects ?? [], {
    day: state.day,
    sceneId,
    propertyDefinitions: content.semantics?.propertyDefinitions
  });
  const withEffects = appliedEffects.state;

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
      state: {
        ...followUpLog,
        activeScene: {
          sceneId,
          currentBeatId: choice.nextBeatId,
          localState,
          choicesMade
        }
      }
    };
  }

  const resolvedState = {
    ...followUpLog,
    activeScene: undefined,
    sceneTableau: followUpLog.sceneTableau.filter((id) => id !== sceneId),
    resolvedScenes: followUpLog.resolvedScenes.includes(sceneId)
      ? followUpLog.resolvedScenes
      : [...followUpLog.resolvedScenes, sceneId]
  };

  return {
    state: resolvedState,
    aftermath: buildSceneAftermath(
      scene,
      choice,
      state,
      resolvedState,
      appliedEffects.changes,
      content
    )
  };
}
