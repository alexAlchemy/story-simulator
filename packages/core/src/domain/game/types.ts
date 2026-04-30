import type { SceneCard } from "../scenes/types";
import type { BoundedGaugeDefinition, SignedGaugeDefinition } from "../semantics/types";
import type { WorldState } from "../world/types";

export type SemanticGaugeDefinition =
  | BoundedGaugeDefinition<string, string>
  | SignedGaugeDefinition<string, string>;

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
  endDay: number;
  semantics?: {
    entityGaugeDefinitions?: Record<string, SemanticGaugeDefinition>;
    relationshipDimensionDefinitions?: Record<string, SemanticGaugeDefinition>;
  };
};
