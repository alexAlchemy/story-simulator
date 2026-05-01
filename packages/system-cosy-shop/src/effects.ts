import type {
  Effect,
  EntityId,
  PropertyKey
} from "@aphebis/core";

import type {
  CosyShopPropertyKey,
  CosyShopQuantityPropertyKey,
  CosyShopScalePropertyKey,
  CosyShopSpectrumPropertyKey
} from "./keys";

export type ShiftAmount = "slightly" | "moderately" | "strongly";

export const shiftAmountDeltas = {
  slightly: 0.1,
  moderately: 0.2,
  strongly: 0.3
} satisfies Record<ShiftAmount, number>;

export function increaseProperty(
  entityId: EntityId,
  property: CosyShopScalePropertyKey | CosyShopSpectrumPropertyKey,
  amount: ShiftAmount
): Effect {
  return changePropertyAmount(entityId, property, "increase", shiftAmountDeltas[amount]);
}

export function decreaseProperty(
  entityId: EntityId,
  property: CosyShopScalePropertyKey | CosyShopSpectrumPropertyKey,
  amount: ShiftAmount
): Effect {
  return changePropertyAmount(entityId, property, "decrease", shiftAmountDeltas[amount]);
}

export function gainPropertyAmount(
  entityId: EntityId,
  property: CosyShopQuantityPropertyKey,
  amount: number
): Effect {
  return {
    kind: "changeProperty",
    entityId,
    property,
    direction: "increase",
    amount
  };
}

export function spendPropertyAmount(
  entityId: EntityId,
  property: CosyShopQuantityPropertyKey,
  amount: number
): Effect {
  return {
    kind: "changeProperty",
    entityId,
    property,
    direction: "decrease",
    amount
  };
}

export const shop = {
  gainStock: (amount: number): Effect => gainCosyPropertyAmount("shop", "stock", amount),
  spendStock: (amount: number): Effect => spendCosyPropertyAmount("shop", "stock", amount),
  gainCoins: (amount: number): Effect => gainCosyPropertyAmount("shop", "coins", amount),
  spendCoins: (amount: number): Effect => spendCosyPropertyAmount("shop", "coins", amount),
  gainStanding: (amount: ShiftAmount): Effect =>
    increaseCosyProperty("shop", "shopStanding", amount),
  loseStanding: (amount: ShiftAmount): Effect =>
    decreaseCosyProperty("shop", "shopStanding", amount),
  gainGoodwill: (amount: ShiftAmount): Effect =>
    increaseCosyProperty("shop", "goodwill", amount),
  loseGoodwill: (amount: ShiftAmount): Effect =>
    decreaseCosyProperty("shop", "goodwill", amount)
};

export const player = {
  gainCompassion: (amount: ShiftAmount): Effect =>
    increaseCosyProperty("player", "compassion", amount),
  loseCompassion: (amount: ShiftAmount): Effect =>
    decreaseCosyProperty("player", "compassion", amount),
  gainPrudence: (amount: ShiftAmount): Effect =>
    increaseCosyProperty("player", "prudence", amount),
  losePrudence: (amount: ShiftAmount): Effect =>
    decreaseCosyProperty("player", "prudence", amount),
  gainFatigue: (amount: ShiftAmount): Effect =>
    increaseCosyProperty("player", "fatigue", amount),
  recoverFatigue: (amount: ShiftAmount): Effect =>
    decreaseCosyProperty("player", "fatigue", amount),
  gainAmbition: (amount: ShiftAmount): Effect =>
    increaseCosyProperty("player", "ambition", amount),
  loseAmbition: (amount: ShiftAmount): Effect =>
    decreaseCosyProperty("player", "ambition", amount)
};

export const apprentice = {
  gainConfidence: (amount: ShiftAmount): Effect =>
    increaseCosyProperty("apprentice", "confidence", amount),
  loseConfidence: (amount: ShiftAmount): Effect =>
    decreaseCosyProperty("apprentice", "confidence", amount),
  gainTrust: (amount: ShiftAmount): Effect =>
    increaseCosyProperty("apprentice", "trust", amount),
  loseTrust: (amount: ShiftAmount): Effect =>
    decreaseCosyProperty("apprentice", "trust", amount),
  gainAffection: (amount: ShiftAmount): Effect =>
    increaseCosyProperty("apprentice", "affection", amount),
  loseAffection: (amount: ShiftAmount): Effect =>
    decreaseCosyProperty("apprentice", "affection", amount),
  gainFear: (amount: ShiftAmount): Effect =>
    increaseCosyProperty("apprentice", "fear", amount),
  loseFear: (amount: ShiftAmount): Effect =>
    decreaseCosyProperty("apprentice", "fear", amount)
};

export const town = {
  gainGossipHeat: (amount: ShiftAmount): Effect =>
    increaseCosyProperty("town", "gossipHeat", amount),
  loseGossipHeat: (amount: ShiftAmount): Effect =>
    decreaseCosyProperty("town", "gossipHeat", amount)
};

export const scenes = {
  add: (sceneId: string): Effect => ({ kind: "addScene", sceneId }),
  remove: (sceneId: string): Effect => ({ kind: "removeScene", sceneId })
};

export const story = {
  setFact: (property: PropertyKey, value: boolean): Effect => ({
    kind: "setProperty",
    entityId: "story",
    property,
    value
  })
};

export function log(text: string): Effect {
  return { kind: "log", text };
}

function gainCosyPropertyAmount(
  entityId: EntityId,
  key: CosyShopQuantityPropertyKey,
  amount: number
): Effect {
  return gainPropertyAmount(entityId, key, amount);
}

function spendCosyPropertyAmount(
  entityId: EntityId,
  key: CosyShopQuantityPropertyKey,
  amount: number
): Effect {
  return spendPropertyAmount(entityId, key, amount);
}

function increaseCosyProperty(
  entityId: EntityId,
  key: CosyShopScalePropertyKey | CosyShopSpectrumPropertyKey,
  amount: ShiftAmount
): Effect {
  return increaseProperty(entityId, key, amount);
}

function decreaseCosyProperty(
  entityId: EntityId,
  key: CosyShopScalePropertyKey | CosyShopSpectrumPropertyKey,
  amount: ShiftAmount
): Effect {
  return decreaseProperty(entityId, key, amount);
}

function changePropertyAmount(
  entityId: EntityId,
  property: CosyShopPropertyKey,
  direction: "increase" | "decrease",
  amount: number
): Effect {
  return {
    kind: "changeProperty",
    entityId,
    property,
    direction,
    amount,
    strength: shiftAmountFromDelta(amount)
  };
}

export function changeProperty(
  entityId: EntityId,
  property: PropertyKey,
  direction: "increase" | "decrease" | "toward",
  amount: ShiftAmount,
  pole?: string
): Effect {
  return {
    kind: "changeProperty",
    entityId,
    property,
    direction,
    strength: shiftAmountToStrength(amount),
    magnitude: shiftAmountToStrength(amount),
    pole
  };
}

function shiftAmountFromDelta(delta: number): "small" | "meaningful" | "major" {
  if (delta >= shiftAmountDeltas.strongly) {
    return "major";
  }
  if (delta >= shiftAmountDeltas.moderately) {
    return "meaningful";
  }
  return "small";
}

function shiftAmountToStrength(amount: ShiftAmount): "small" | "meaningful" | "major" {
  switch (amount) {
    case "slightly":
      return "small";
    case "moderately":
      return "meaningful";
    case "strongly":
      return "major";
  }
}
