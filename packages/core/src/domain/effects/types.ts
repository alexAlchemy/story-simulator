import type { EntityId } from "../ids";
import type { GaugeKey, QuantityKey } from "../world/keys";

export type Effect =
  | { kind: "entityGauge"; entityId: EntityId; key: GaugeKey; delta: number }
  | { kind: "entityQuantity"; entityId: EntityId; key: QuantityKey; delta: number }
  | { kind: "setFlag"; key: string; value: boolean }
  | { kind: "addScene"; sceneId: string }
  | { kind: "removeScene"; sceneId: string }
  | { kind: "log"; text: string };

export type EffectContext = {
  day: number;
  sceneId?: string;
};
