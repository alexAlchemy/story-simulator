import type { EntityId } from "../ids";

export type PropertyKey = string;

export type PropertyKind = "quantity" | "scale" | "spectrum" | "flag";

export type PropertyValue = number | boolean;

export type ChangeStrength =
  | "trace"
  | "minor"
  | "small"
  | "meaningful"
  | "major"
  | "defining";

export type PropertyThreshold<TLabel extends string = string> = {
  rank: number;
  min: number;
  label: TLabel;
  description: string;
  requiresMagnitude?: ChangeStrength;
};

export type PropertyChangePolicy =
  | { kind: "direct" }
  | { kind: "bounded"; amounts: Partial<Record<ChangeStrength, number>> }
  | { kind: "moveToward"; amounts: Partial<Record<ChangeStrength, number>> };

export type BasePropertyDefinition<
  TKey extends string = string,
  TKind extends PropertyKind = PropertyKind
> = {
  key: TKey;
  kind: TKind;
  label: string;
  description: string;
  aliases?: string[];
};

export type QuantityPropertyDefinition<TKey extends string = string> =
  BasePropertyDefinition<TKey, "quantity"> & {
    minimumValue?: number;
    thresholds?: readonly PropertyThreshold[];
    changePolicy?: PropertyChangePolicy;
  };

export type ScalePropertyDefinition<TKey extends string = string> =
  BasePropertyDefinition<TKey, "scale"> & {
    minimumValue: number;
    maximumValue: number;
    thresholds: readonly PropertyThreshold[];
    changePolicy: PropertyChangePolicy;
  };

export type SpectrumPole = {
  label: string;
  value: number;
  description?: string;
};

export type SpectrumPropertyDefinition<TKey extends string = string> =
  BasePropertyDefinition<TKey, "spectrum"> & {
    minimumValue: number;
    maximumValue: number;
    negativePole: SpectrumPole;
    positivePole: SpectrumPole;
    thresholds: readonly PropertyThreshold[];
    changePolicy: PropertyChangePolicy;
  };

export type FlagPropertyDefinition<TKey extends string = string> =
  BasePropertyDefinition<TKey, "flag"> & {
    trueLabel?: string;
    falseLabel?: string;
  };

export type PropertyDefinition<TKey extends string = string> =
  | QuantityPropertyDefinition<TKey>
  | ScalePropertyDefinition<TKey>
  | SpectrumPropertyDefinition<TKey>
  | FlagPropertyDefinition<TKey>;

export type PropertyChangeDirection = "increase" | "decrease" | "toward";

export type PropertyEffect = {
  kind: "changeProperty";
  entityId: EntityId;
  property: PropertyKey;
  direction: PropertyChangeDirection;
  strength?: ChangeStrength;
  magnitude?: ChangeStrength;
  amount?: number;
  pole?: string;
  ceilingLabel?: string;
  floorLabel?: string;
  reason?: string;
};

export type SetPropertyEffect = {
  kind: "setProperty";
  entityId: EntityId;
  property: PropertyKey;
  value: PropertyValue;
};

export type PropertyCondition = {
  kind: "property";
  entityId: EntityId;
  property: PropertyKey;
  min?: number;
  max?: number;
  equals?: number;
  minLabel?: string;
  maxLabel?: string;
  equalsLabel?: string;
  value?: PropertyValue;
};

