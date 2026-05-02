import type { EntityId } from "../ids";
import type { Effect } from "../effects/types";
import type { PropertyCondition } from "../properties";

export type SceneType = string;
export type LocalStateValue = number | string | boolean;

export type LocalEffect =
  | {
      kind: "setLocal";
      key: string;
      value: LocalStateValue;
    }
  | {
      kind: "changeLocal";
      key: string;
      delta: number;
    };

export type LocalCondition = {
  key: string;
  min?: number;
  max?: number;
  equals?: LocalStateValue;
  present?: boolean;
};

export type LocalAvailability = {
  all?: LocalCondition[];
  any?: LocalCondition[];
};

export type SceneLocalProperty = {
  initial: LocalStateValue;
  min?: number;
  max?: number;
};

export type SceneChoice = {
  id: string;
  label: string;
  description?: string;
  effects: Effect[];
  followUpText?: string;
};

export type BeatChoice = {
  id: string;
  label: string;
  description?: string;
  intent?: string;
  localEffects?: LocalEffect[];
  effects?: Effect[];
  nextBeatId?: string;
  endsScene?: boolean;
  followUpText?: string;
  availability?: LocalAvailability;
};

export type SceneBeat = {
  id: string;
  title?: string;
  text: string;
  choices: BeatChoice[];
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
  | PropertyCondition
  | ({
      kind: "day";
    } & SceneNumericComparison)
  | {
      kind: "resolvedScene";
      sceneId: string;
      present?: boolean;
    };

export type Scene = {
  id: string;
  title: string;
  type: SceneType;
  description: string;
  choices?: SceneChoice[];
  localProperties?: Record<string, SceneLocalProperty>;
  beats?: Record<string, SceneBeat>;
  startBeatId?: string;
  availability?: SceneAvailability;
};
