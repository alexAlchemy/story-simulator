export type ResourceKey = "coins" | "stock" | "fatigue";

export type ValueKey = "compassion" | "prudence" | "ambition";

export type RelationshipKey = "apprenticeTrust" | "townTrust";

export type SceneType =
  | "customer"
  | "staff"
  | "shop"
  | "town"
  | "reflection"
  | "brew";

export type GameLogEntry = {
  id: string;
  day: number;
  sceneId?: string;
  text: string;
};

export type GameState = {
  day: number;
  resources: Record<ResourceKey, number>;
  values: Record<ValueKey, number>;
  relationships: Record<RelationshipKey, number>;
  flags: Record<string, boolean>;
  sceneTableau: string[];
  resolvedScenes: string[];
  log: GameLogEntry[];
  ended: boolean;
};

export type Boon = {
  label: string;
  description?: string;
};

export type Bane = {
  label: string;
  description?: string;
  hidden?: boolean;
};

export type SceneClock = {
  expiresOnDay?: number;
  transformsOnDay?: number;
  transformsInto?: string;
};

export type SceneChoice = {
  id: string;
  label: string;
  description?: string;
  effects: Effect[];
  followUpText?: string;
};

export type SceneCard = {
  id: string;
  title: string;
  type: SceneType;
  description: string;
  coreQuestion: string;
  boons?: Boon[];
  banes?: Bane[];
  choices: SceneChoice[];
  clock?: SceneClock;
};

export type Effect =
  | { kind: "resource"; key: ResourceKey; delta: number }
  | { kind: "value"; key: ValueKey; delta: number }
  | { kind: "relationship"; key: RelationshipKey; delta: number }
  | { kind: "setFlag"; key: string; value: boolean }
  | { kind: "addScene"; sceneId: string }
  | { kind: "removeScene"; sceneId: string }
  | { kind: "log"; text: string };

export type GameContent = {
  scenes: Record<string, SceneCard>;
  dayPlan: Record<number, string[]>;
  rentDueDay: number;
  rentAmount: number;
};

export type EffectContext = {
  day: number;
  sceneId?: string;
};

export type EndingSummary = {
  title: string;
  shopOutcome: string;
  identityOutcome: string;
  relationshipOutcome: string;
  futureHook: string;
};
