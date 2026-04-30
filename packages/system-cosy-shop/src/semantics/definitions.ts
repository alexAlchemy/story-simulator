import type {
  BoundedGaugeDefinition,
  OpenQuantityDefinition,
  OpenQuantityContext,
  SemanticPole,
  SemanticThreshold,
  SignedGaugeDefinition
} from "@aphebis/core";
import type {
  CosyShopGaugeKey,
  CosyShopRelationshipDimensionKey
} from "../keys";

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

export type CompassionLabel =
  | "Cold"
  | "Reserved"
  | "Neutral"
  | "Tender"
  | "Compassionate";

export type PrudenceLabel =
  | "Impulsive"
  | "Instinctive"
  | "Neutral"
  | "Careful"
  | "Prudent";

export type AmbitionLabel =
  | "Humble"
  | "Content"
  | "Neutral"
  | "Driven"
  | "Ambitious";

export type ConfidenceLabel =
  | "Shaken"
  | "Unsure"
  | "FindingFooting"
  | "Assured"
  | "Radiant";

export type GossipHeatLabel =
  | "Quiet"
  | "Murmuring"
  | "Buzzing"
  | "Volatile"
  | "Scandalous";

export type AffectionLabel =
  | "Cool"
  | "Softening"
  | "Fond"
  | "Warm"
  | "Cherished";

export type RespectLabel =
  | "Dismissive"
  | "Noticing"
  | "Credible"
  | "Esteemed"
  | "Admired";

export type FearLabel =
  | "Unafraid"
  | "Uneasy"
  | "Cautious"
  | "Frightened"
  | "Dreadful";

export type ResentmentLabel =
  | "Clear"
  | "Irritated"
  | "Sore"
  | "Bitter"
  | "Grievance";

export type ObligationLabel =
  | "Free"
  | "Owing"
  | "Indebted"
  | "Bound"
  | "Beholden";

export type GoodwillLabel =
  | "Indifferent"
  | "Open"
  | "Kindly"
  | "Generous"
  | "Protective";

export type FamiliarityLabel =
  | "Unknown"
  | "Recognized"
  | "Known"
  | "Comfortable"
  | "Intimate";

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

export const compassionThresholds = [
  {
    rank: 0,
    min: -1,
    label: "Cold",
    description: "Care is being withheld, even when need is visible."
  },
  {
    rank: 1,
    min: -0.4,
    label: "Reserved",
    description: "Feeling is present, but kept at a careful distance."
  },
  {
    rank: 2,
    min: -0.1,
    label: "Neutral",
    description: "Compassion and detachment are still in ordinary balance."
  },
  {
    rank: 3,
    min: 0.25,
    label: "Tender",
    description: "Care is beginning to shape decisions."
  },
  {
    rank: 4,
    min: 0.65,
    label: "Compassionate",
    description: "The shopkeeper is strongly moved by the needs of others."
  }
] as const satisfies readonly SemanticThreshold<CompassionLabel>[];

export const prudenceThresholds = [
  {
    rank: 0,
    min: -1,
    label: "Impulsive",
    description: "Immediate feeling is outrunning caution."
  },
  {
    rank: 1,
    min: -0.4,
    label: "Instinctive",
    description: "Choices lean toward gut response over planning."
  },
  {
    rank: 2,
    min: -0.1,
    label: "Neutral",
    description: "Prudence and impulse are still in ordinary balance."
  },
  {
    rank: 3,
    min: 0.25,
    label: "Careful",
    description: "Consequences are beginning to weigh on decisions."
  },
  {
    rank: 4,
    min: 0.65,
    label: "Prudent",
    description: "The shopkeeper strongly favours caution and preparation."
  }
] as const satisfies readonly SemanticThreshold<PrudenceLabel>[];

export const ambitionThresholds = [
  {
    rank: 0,
    min: -1,
    label: "Humble",
    description: "Personal advancement is being set aside."
  },
  {
    rank: 1,
    min: -0.4,
    label: "Content",
    description: "The shopkeeper is leaning away from larger wants."
  },
  {
    rank: 2,
    min: -0.1,
    label: "Neutral",
    description: "Ambition and contentment are still in ordinary balance."
  },
  {
    rank: 3,
    min: 0.25,
    label: "Driven",
    description: "Growth and recognition are beginning to shape decisions."
  },
  {
    rank: 4,
    min: 0.65,
    label: "Ambitious",
    description: "The shopkeeper is strongly pulled toward advancement."
  }
] as const satisfies readonly SemanticThreshold<AmbitionLabel>[];

export const confidenceThresholds = [
  { rank: 0, min: 0, label: "Shaken", description: "Self-belief is fragile and easily knocked." },
  { rank: 1, min: 0.2, label: "Unsure", description: "There is ability here, but hesitation too." },
  {
    rank: 2,
    min: 0.45,
    label: "FindingFooting",
    description: "Confidence is becoming steady enough to act on."
  },
  {
    rank: 3,
    min: 0.7,
    label: "Assured",
    description: "They can trust their own hands under ordinary pressure."
  },
  {
    rank: 4,
    min: 0.9,
    label: "Radiant",
    description: "Confidence is bright enough to steady other people too."
  }
] as const satisfies readonly SemanticThreshold<ConfidenceLabel>[];

export const gossipHeatThresholds = [
  { rank: 0, min: 0, label: "Quiet", description: "Town talk is barely touching the shop." },
  {
    rank: 1,
    min: 0.2,
    label: "Murmuring",
    description: "A few people are talking, but the mood is still soft."
  },
  {
    rank: 2,
    min: 0.45,
    label: "Buzzing",
    description: "The shop is becoming a subject of active conversation."
  },
  {
    rank: 3,
    min: 0.7,
    label: "Volatile",
    description: "Rumour is moving quickly enough to distort events."
  },
  {
    rank: 4,
    min: 0.9,
    label: "Scandalous",
    description: "The town is primed to turn one incident into a story."
  }
] as const satisfies readonly SemanticThreshold<GossipHeatLabel>[];

export const affectionThresholds = [
  { rank: 0, min: 0, label: "Cool", description: "There is little personal warmth here." },
  { rank: 1, min: 0.2, label: "Softening", description: "Warmth is possible, but still tentative." },
  { rank: 2, min: 0.45, label: "Fond", description: "There is real fondness in the connection." },
  { rank: 3, min: 0.7, label: "Warm", description: "Affection is strong enough to shape choices." },
  { rank: 4, min: 0.9, label: "Cherished", description: "The bond carries deep personal care." }
] as const satisfies readonly SemanticThreshold<AffectionLabel>[];

export const respectThresholds = [
  { rank: 0, min: 0, label: "Dismissive", description: "Competence or judgement is not yet valued." },
  { rank: 1, min: 0.2, label: "Noticing", description: "Respect is beginning, but not yet settled." },
  { rank: 2, min: 0.45, label: "Credible", description: "Words and choices carry some weight." },
  { rank: 3, min: 0.7, label: "Esteemed", description: "Judgement is trusted under ordinary strain." },
  { rank: 4, min: 0.9, label: "Admired", description: "Respect has become open admiration." }
] as const satisfies readonly SemanticThreshold<RespectLabel>[];

export const fearThresholds = [
  { rank: 0, min: 0, label: "Unafraid", description: "Fear is not shaping the relationship." },
  { rank: 1, min: 0.2, label: "Uneasy", description: "There is discomfort, but not alarm." },
  { rank: 2, min: 0.45, label: "Cautious", description: "Fear is making people careful." },
  { rank: 3, min: 0.7, label: "Frightened", description: "Fear is steering what feels possible." },
  { rank: 4, min: 0.9, label: "Dreadful", description: "The relationship is dominated by dread." }
] as const satisfies readonly SemanticThreshold<FearLabel>[];

export const resentmentThresholds = [
  { rank: 0, min: 0, label: "Clear", description: "No grudge is currently carrying forward." },
  { rank: 1, min: 0.2, label: "Irritated", description: "A small slight is still being felt." },
  { rank: 2, min: 0.45, label: "Sore", description: "The hurt is present enough to colour trust." },
  { rank: 3, min: 0.7, label: "Bitter", description: "Resentment is actively shaping reactions." },
  { rank: 4, min: 0.9, label: "Grievance", description: "The relationship now carries a serious grievance." }
] as const satisfies readonly SemanticThreshold<ResentmentLabel>[];

export const obligationThresholds = [
  { rank: 0, min: 0, label: "Free", description: "No meaningful debt is pressing here." },
  { rank: 1, min: 0.2, label: "Owing", description: "A small debt or duty is remembered." },
  { rank: 2, min: 0.45, label: "Indebted", description: "The obligation is hard to ignore." },
  { rank: 3, min: 0.7, label: "Bound", description: "Duty is strongly constraining the relationship." },
  { rank: 4, min: 0.9, label: "Beholden", description: "Obligation has become a defining bond." }
] as const satisfies readonly SemanticThreshold<ObligationLabel>[];

export const goodwillThresholds = [
  { rank: 0, min: 0, label: "Indifferent", description: "There is little active goodwill to draw on." },
  { rank: 1, min: 0.2, label: "Open", description: "People are willing to give the shop a chance." },
  { rank: 2, min: 0.45, label: "Kindly", description: "The relationship leans toward generosity." },
  { rank: 3, min: 0.7, label: "Generous", description: "Goodwill is strong enough to soften mistakes." },
  { rank: 4, min: 0.9, label: "Protective", description: "People are inclined to defend the bond." }
] as const satisfies readonly SemanticThreshold<GoodwillLabel>[];

export const familiarityThresholds = [
  { rank: 0, min: 0, label: "Unknown", description: "The relationship has little shared history." },
  { rank: 1, min: 0.2, label: "Recognized", description: "There is enough contact to be remembered." },
  { rank: 2, min: 0.45, label: "Known", description: "Patterns and habits are becoming legible." },
  { rank: 3, min: 0.7, label: "Comfortable", description: "Familiarity makes interaction easier." },
  { rank: 4, min: 0.9, label: "Intimate", description: "The bond carries deep knowledge of the other." }
] as const satisfies readonly SemanticThreshold<FamiliarityLabel>[];

export type CoinsContext = {
  rentAmount: number;
};

export type StockContext = {
  expectedDemand: number;
};

export const boundedGaugeDefinition = <TKey extends string, TLabel extends string>(
  key: TKey,
  thresholds: readonly SemanticThreshold<TLabel>[],
  poles?: BoundedGaugeDefinition<TKey, TLabel>["poles"]
): BoundedGaugeDefinition<TKey, TLabel> => ({
  family: "boundedGauge",
  key,
  minimumValue: 0,
  maximumValue: 1,
  thresholds,
  curve: { power: 1.35, minimumFactor: 0.1 },
  poles
});

export const signedGaugeDefinition = <TKey extends string, TLabel extends string>(
  key: TKey,
  thresholds: readonly SemanticThreshold<TLabel>[],
  poles?: SignedGaugeDefinition<TKey, TLabel>["poles"]
): SignedGaugeDefinition<TKey, TLabel> => ({
  family: "signedGauge",
  key,
  minimumValue: -1,
  maximumValue: 1,
  thresholds,
  curve: { power: 1.35, minimumFactor: 0.1 },
  poles
});

const pole = (name: string, aliases: string[] = []): SemanticPole => ({
  name,
  aliases
});

export const fatigueDefinition = boundedGaugeDefinition("fatigue", fatigueThresholds, {
  low: pole("rest", ["rested", "freshness", "recovery"]),
  high: pole("fatigue", ["tiredness", "strain", "exhaustion"])
});

export const trustDefinition = boundedGaugeDefinition("trust", trustThresholds, {
  low: pole("distrust", ["suspicion", "wariness"]),
  high: pole("trust", ["faith", "reliance"])
});

export const compassionDefinition = signedGaugeDefinition(
  "compassion",
  compassionThresholds,
  {
    negative: pole("coldness", ["detachment", "reserve"]),
    positive: pole("compassion", ["care", "mercy", "tenderness"])
  }
);
export const prudenceDefinition = signedGaugeDefinition(
  "prudence",
  prudenceThresholds,
  {
    negative: pole("impulse", ["instinct", "risk", "spontaneity"]),
    positive: pole("prudence", ["caution", "carefulness", "preparation"])
  }
);
export const ambitionDefinition = signedGaugeDefinition(
  "ambition",
  ambitionThresholds,
  {
    negative: pole("contentment", ["humility", "modesty"]),
    positive: pole("ambition", ["drive", "advancement", "recognition"])
  }
);
export const confidenceDefinition = boundedGaugeDefinition(
  "confidence",
  confidenceThresholds,
  {
    low: pole("doubt", ["uncertainty", "hesitation"]),
    high: pole("confidence", ["assurance", "self-belief"])
  }
);
export const gossipHeatDefinition = boundedGaugeDefinition(
  "gossipHeat",
  gossipHeatThresholds,
  {
    low: pole("quiet", ["discretion", "calm"]),
    high: pole("gossip", ["rumour", "rumor", "attention", "scandal"])
  }
);

export const affectionDefinition = boundedGaugeDefinition(
  "affection",
  affectionThresholds,
  {
    low: pole("distance", ["coolness"]),
    high: pole("affection", ["warmth", "fondness", "care"])
  }
);
export const respectDefinition = boundedGaugeDefinition("respect", respectThresholds, {
  low: pole("dismissal", ["disrespect"]),
  high: pole("respect", ["esteem", "admiration", "credibility"])
});
export const fearDefinition = boundedGaugeDefinition("fear", fearThresholds, {
  low: pole("courage", ["safety", "ease", "bravery"]),
  high: pole("fear", ["dread", "intimidation"])
});
export const resentmentDefinition = boundedGaugeDefinition(
  "resentment",
  resentmentThresholds,
  {
    low: pole("forgiveness", ["ease", "clear air"]),
    high: pole("resentment", ["bitterness", "grudge", "grievance"])
  }
);
export const obligationDefinition = boundedGaugeDefinition(
  "obligation",
  obligationThresholds,
  {
    low: pole("freedom", ["release"]),
    high: pole("obligation", ["debt", "duty", "beholdenness"])
  }
);
export const goodwillDefinition = boundedGaugeDefinition("goodwill", goodwillThresholds, {
  low: pole("indifference", ["ill-will", "distance"]),
  high: pole("goodwill", ["generosity", "kindness", "support"])
});
export const familiarityDefinition = boundedGaugeDefinition(
  "familiarity",
  familiarityThresholds,
  {
    low: pole("strangeness", ["distance", "unknownness"]),
    high: pole("familiarity", ["closeness", "intimacy", "comfort"])
  }
);

export const entityGaugeDefinitions = {
  fatigue: fatigueDefinition,
  compassion: compassionDefinition,
  prudence: prudenceDefinition,
  ambition: ambitionDefinition,
  confidence: confidenceDefinition,
  gossipHeat: gossipHeatDefinition
} satisfies Record<
  CosyShopGaugeKey,
  BoundedGaugeDefinition<string, string> | SignedGaugeDefinition<string, string>
>;

export const relationshipDimensionDefinitions = {
  trust: trustDefinition,
  affection: affectionDefinition,
  respect: respectDefinition,
  fear: fearDefinition,
  resentment: resentmentDefinition,
  obligation: obligationDefinition,
  goodwill: goodwillDefinition,
  familiarity: familiarityDefinition
} satisfies Record<
  CosyShopRelationshipDimensionKey,
  BoundedGaugeDefinition<string, string>
>;

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

export function describeCoinsContext(rentAmount: number): OpenQuantityContext {
  return coinsDefinition.describeContext({ rentAmount });
}

export function describeStockContext(expectedDemand: number): OpenQuantityContext {
  return stockDefinition.describeContext({ expectedDemand });
}
