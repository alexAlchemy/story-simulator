import type { GameContent, GameState } from "../domain/types";
import { applyEffects } from "./applyEffects";
import { canSeeScene } from "./sceneAvailability";

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

  const choice = scene.choices.find((candidate) => candidate.id === choiceId);
  if (!choice) {
    throw new Error(`Unknown choice id "${choiceId}" for scene "${sceneId}"`);
  }

  if (!canSeeScene(scene, state, content)) {
    throw new Error(`Scene is not currently available: ${sceneId}`);
  }

  const withEffects = applyEffects(state, choice.effects, {
    day: state.day,
    sceneId
  });

  const followUpLog = choice.followUpText
    ? applyEffects(
        withEffects,
        [{ kind: "log", text: choice.followUpText }],
        { day: state.day, sceneId }
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
