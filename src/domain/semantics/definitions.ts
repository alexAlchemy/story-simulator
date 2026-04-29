import type {
  BoundedGaugeDefinition,
  OpenQuantityDefinition,
  OpenQuantityContext,
  SemanticThreshold,
  SignedGaugeDefinition
} from "./types";

export type FatigueLabel =
  | "Rested"
  | "Tired"
  | "Strained"
  | "Exhausted"
  | "Spent";

export type TrustLabel =
  | "Distrustful"
  | "Wary"
  | "Tentative"
  | "Trusting"
  | "Devoted";

export type CoinLabel =
  | "Desperate"
  | "Short"
  | "Close"
  | "RentReady"
  | "Comfortable";

export type StockLabel =
  | "Empty"
  | "Scarce"
  | "Manageable"
  | "WellStocked"
  | "Abundant";

export const fatigueThresholds = [
  { rank: 0, min: 0, label: "Rested", description: "Clear-headed and physically steady." },
  { rank: 1, min: 0.2, label: "Tired", description: "Fatigue is present but manageable." },
  {
    rank: 2,
    min: 0.45,
    label: "Strained",
    description: "Fatigue is shaping judgement and patience."
  },
  {
    rank: 3,
    min: 0.7,
    label: "Exhausted",
    description: "Close to mistakes, snapping, or collapse."
  },
  {
    rank: 4,
    min: 0.9,
    label: "Spent",
    description: "Continuing would be unsafe or emotionally costly."
  }
] as const satisfies readonly SemanticThreshold<FatigueLabel>[];

export const trustThresholds = [
  { rank: 0, min: 0, label: "Distrustful", description: "The bond is guarded and uncertain." },
  { rank: 1, min: 0.2, label: "Wary", description: "There is room for trust, but not ease." },
  {
    rank: 2,
    min: 0.45,
    label: "Tentative",
    description: "Trust is present, but still being tested."
  },
  {
    rank: 3,
    min: 0.7,
    label: "Trusting",
    description: "The relationship can bear ordinary strain."
  },
  {
    rank: 4,
    min: 0.9,
    label: "Devoted",
    description: "Trust is deep enough to carry risk for the other."
  }
] as const satisfies readonly SemanticThreshold<TrustLabel>[];

export const coinsThresholds = [
  {
    rank: 0,
    min: 0,
    label: "Desperate",
    description: "The pile is far below the amount needed to stay afloat."
  },
  {
    rank: 1,
    min: 0.2,
    label: "Short",
    description: "There is money on hand, but the bill still bites."
  },
  {
    rank: 2,
    min: 0.5,
    label: "Close",
    description: "The shop is near the target, but not comfortably past it."
  },
  {
    rank: 3,
    min: 0.85,
    label: "RentReady",
    description: "There is enough to meet the immediate obligation."
  },
  {
    rank: 4,
    min: 1.2,
    label: "Comfortable",
    description: "The shop can absorb a few ordinary setbacks."
  }
] as const satisfies readonly SemanticThreshold<CoinLabel>[];

export const stockThresholds = [
  { rank: 0, min: 0, label: "Empty", description: "There is nothing left to sell." },
  {
    rank: 1,
    min: 0.2,
    label: "Scarce",
    description: "A few items remain, but choice is very thin."
  },
  {
    rank: 2,
    min: 0.5,
    label: "Manageable",
    description: "The stock can cover routine demand for now."
  },
  {
    rank: 3,
    min: 0.9,
    label: "WellStocked",
    description: "The shelf has enough depth to feel secure."
  },
  {
    rank: 4,
    min: 1.5,
    label: "Abundant",
    description: "The shop can meet demand and still have spare stock."
  }
] as const satisfies readonly SemanticThreshold<StockLabel>[];

export type CoinsContext = {
  rentAmount: number;
};

export type StockContext = {
  expectedDemand: number;
};

export const fatigueDefinition: BoundedGaugeDefinition<"fatigue", FatigueLabel> = {
  family: "boundedGauge",
  key: "fatigue",
  minimumValue: 0,
  maximumValue: 1,
  thresholds: fatigueThresholds,
  curve: { power: 1.35, minimumFactor: 0.1 }
};

export const trustDefinition: BoundedGaugeDefinition<"trust", TrustLabel> = {
  family: "boundedGauge",
  key: "trust",
  minimumValue: 0,
  maximumValue: 1,
  thresholds: trustThresholds,
  curve: { power: 1.35, minimumFactor: 0.1 }
};

export const coinsDefinition: OpenQuantityDefinition<"coins", CoinLabel, CoinsContext> = {
  family: "openQuantity",
  key: "coins",
  thresholds: coinsThresholds,
  describeContext: ({ rentAmount }) => ({
    contextLabel: "rent",
    referenceValue: rentAmount
  })
};

export const stockDefinition: OpenQuantityDefinition<"stock", StockLabel, StockContext> = {
  family: "openQuantity",
  key: "stock",
  thresholds: stockThresholds,
  describeContext: ({ expectedDemand }) => ({
    contextLabel: "demand",
    referenceValue: expectedDemand
  })
};

export const signedGaugeDefinition = <TKey extends string, TLabel extends string>(
  key: TKey,
  thresholds: readonly SemanticThreshold<TLabel>[]
): SignedGaugeDefinition<TKey, TLabel> => ({
  family: "signedGauge",
  key,
  minimumValue: -1,
  maximumValue: 1,
  thresholds,
  curve: { power: 1.35, minimumFactor: 0.1 }
});

export function describeCoinsContext(rentAmount: number): OpenQuantityContext {
  return coinsDefinition.describeContext({ rentAmount });
}

export function describeStockContext(expectedDemand: number): OpenQuantityContext {
  return stockDefinition.describeContext({ expectedDemand });
}
