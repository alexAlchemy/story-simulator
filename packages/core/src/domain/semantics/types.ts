export type SemanticFamily = "boundedGauge" | "signedGauge" | "openQuantity";

export type SemanticThreshold<TLabel extends string = string> = {
  rank: number;
  min: number;
  label: TLabel;
  description: string;
};

export type SemanticValue<TKey extends string = string, TLabel extends string = string> = {
  key: TKey;
  value: number;
  label: TLabel;
  rank: number;
  description: string;
};

export type BoundedGaugeDefinition<
  TKey extends string,
  TLabel extends string
> = {
  family: "boundedGauge";
  key: TKey;
  minimumValue: 0;
  maximumValue: 1;
  thresholds: readonly SemanticThreshold<TLabel>[];
};

export type SignedGaugeDefinition<
  TKey extends string,
  TLabel extends string
> = {
  family: "signedGauge";
  key: TKey;
  minimumValue: -1;
  maximumValue: 1;
  thresholds: readonly SemanticThreshold<TLabel>[];
};

export type OpenQuantityContext = {
  contextLabel: string;
  referenceValue: number;
};

export type OpenQuantityDefinition<
  TKey extends string,
  TLabel extends string,
  TContext
> = {
  family: "openQuantity";
  key: TKey;
  thresholds: readonly SemanticThreshold<TLabel>[];
  describeContext: (context: TContext) => OpenQuantityContext;
};
