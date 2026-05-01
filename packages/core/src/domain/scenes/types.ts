import type { EntityId, RelationshipId } from "../ids";
import type { Effect } from "../effects/types";
import type { GaugeKey, QuantityKey, RelationshipDimensionKey } from "../world/keys";

export type SceneType = string;

export type SceneChoice = {
  id: string;
  label: string;
  description?: string;
  effects: Effect[];
  followUpText?: string;
};

export type SceneNumericComparison = {
  min?: number;
  max?: number;
  equals?: number;
};

export type SceneSemanticComparison = {
  minLabel?: string;
  maxLabel?: string;
  equalsLabel?: string;
};

export type SceneAvailability = {
  all?: SceneAvailabilityCondition[];
  any?: SceneAvailabilityCondition[];
};

export type SceneAvailabilityCondition =
  | ({
      kind: "day";
    } & SceneNumericComparison)
  | {
      kind: "resolvedScene";
      sceneId: string;
      present?: boolean;
    }
  | {
      kind: "flag";
      key: string;
      value?: boolean;
    }
  | ({
      kind: "entityGauge";
      entityId: EntityId;
      key: GaugeKey;
    } & SceneNumericComparison &
    SceneSemanticComparison)
  | ({
      kind: "entityQuantity";
      entityId: EntityId;
      key: QuantityKey;
    } & SceneNumericComparison)
  | ({
      kind: "relationshipDimension";
      relationshipId: RelationshipId;
      key: RelationshipDimensionKey;
    } & SceneNumericComparison &
    SceneSemanticComparison);

export type Scene = {
  id: string;
  title: string;
  type: SceneType;
  description: string;
  choices: SceneChoice[];
  availability?: SceneAvailability;
};
