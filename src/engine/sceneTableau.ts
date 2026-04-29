import type { GameContent, GameState, SceneCard } from "../domain/types";

export function getVisibleScenes(
  state: GameState,
  content: GameContent
): SceneCard[] {
  return state.sceneTableau
    .map((sceneId) => content.scenes[sceneId])
    .filter((scene): scene is SceneCard => Boolean(scene));
}
