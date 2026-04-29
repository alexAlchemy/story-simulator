import type { EntityId, RelationshipId } from "../ids";
import type { GaugeKey, QuantityKey, RelationshipDimensionKey } from "../world/keys";
import type { RelationshipToken } from "../world/types";

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

export type EffectContext = {
  day: number;
  sceneId?: string;
};

