import type { Scene } from "../scenes/types";
import type { WorldState } from "../world/types";
import type { PropertyDefinition } from "../properties";
import type { LocalStateValue } from "../scenes/types";

export type GameLogEntry = {
  id: string;
  day: number;
  sceneId?: string;
  text: string;
};

export type GameState = {
  day: number;
  world: WorldState;
  sceneTableau: string[];
  activeScene?: ActiveSceneSession;
  resolvedScenes: string[];
  log: GameLogEntry[];
  ended: boolean;
};

export type ActiveSceneSession = {
  sceneId: string;
  currentBeatId: string;
  localState: Record<string, LocalStateValue>;
  choicesMade: string[];
};

export type GameContent = {
  scenes: Record<string, Scene>;
  dayPlan: Record<number, string[]>;
  endDay: number;
  semantics?: {
    propertyDefinitions?: Record<string, PropertyDefinition>;
  };
};
