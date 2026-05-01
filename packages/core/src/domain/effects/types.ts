import type { EntityId } from "../ids";
import type { PropertyEffect, SetPropertyEffect } from "../properties";

export type Effect =
  | PropertyEffect
  | SetPropertyEffect
  | { kind: "addScene"; sceneId: string }
  | { kind: "removeScene"; sceneId: string }
  | { kind: "log"; text: string };

export type EffectContext = {
  day: number;
  sceneId?: string;
  propertyDefinitions?: Record<string, import("../properties").PropertyDefinition>;
};
