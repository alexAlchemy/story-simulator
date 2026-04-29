export type EntityId = string;
export type RelationshipId = string;

export type EntityKind = "person" | "group" | "shop" | "place";

export type GaugeKey =
  | "fatigue"
  | "compassion"
  | "prudence"
  | "ambition"
  | "confidence"
  | "gossipHeat";

export type QuantityKey = "coins" | "stock";

export type RelationshipDimensionKey =
  | "trust"
  | "affection"
  | "respect"
  | "fear"
  | "resentment"
  | "obligation"
  | "goodwill"
  | "familiarity";

export type RelationshipToken = {
  id: string;
  kind: "debt" | "promise" | "wound" | "secret" | "favour" | "obligation";
  label: string;
  description?: string;
  sourceSceneId?: string;
};

export type EntityState = {
  id: EntityId;
  kind: EntityKind;
  displayName: string;
  tags: string[];
  gauges: Partial<Record<GaugeKey, number>>;
  quantities: Partial<Record<QuantityKey, number>>;
  flags: Record<string, boolean>;
};

export type RelationshipState = {
  id: RelationshipId;
  from: EntityId;
  to: EntityId;
  dimensions: Partial<Record<RelationshipDimensionKey, number>>;
  flags: Record<string, boolean>;
  tokens: RelationshipToken[];
};

export type WorldState = {
  entities: Record<EntityId, EntityState>;
  relationships: Record<RelationshipId, RelationshipState>;
};

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
  world: WorldState;
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
  | { kind: "entityGauge"; entityId: EntityId; key: GaugeKey; delta: number }
  | { kind: "entityQuantity"; entityId: EntityId; key: QuantityKey; delta: number }
  | {
      kind: "relationshipDimension";
      relationshipId: RelationshipId;
      key: RelationshipDimensionKey;
      delta: number;
    }
  | {
      kind: "addRelationshipToken";
      relationshipId: RelationshipId;
      token: RelationshipToken;
    }
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
