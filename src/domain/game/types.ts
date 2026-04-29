import type { SceneCard } from "../scenes/types";
import type { WorldState } from "../world/types";

export type GameLogEntry = {
  id: string;
  day: number;
  sceneId?: string;
  text: string;
};

export type GameState = {
  day: number;
  world: WorldState;
  flags: Record<string, boolean>;
  sceneTableau: string[];
  resolvedScenes: string[];
  log: GameLogEntry[];
  ended: boolean;
};

export type GameContent = {
  scenes: Record<string, SceneCard>;
  dayPlan: Record<number, string[]>;
  rentDueDay: number;
  rentAmount: number;
};

export type EndingSummary = {
  title: string;
  shopOutcome: string;
  identityOutcome: string;
  relationshipOutcome: string;
  futureHook: string;
};

