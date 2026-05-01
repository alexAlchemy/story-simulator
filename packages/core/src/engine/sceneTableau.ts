import type { GameContent, GameState, Scene } from "../domain";
import { canSeeScene } from "./sceneAvailability";

export function getVisibleScenes(
  state: GameState,
  content: GameContent
): Scene[] {
  return state.sceneTableau
    .map((sceneId) => content.scenes[sceneId])
    .filter((scene): scene is Scene => Boolean(scene))
    .filter((scene) => canSeeScene(scene, state, content));
}
