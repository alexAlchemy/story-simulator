import type {
  Effect,
  EntityId,
  GaugeKey,
  QuantityKey
} from "@aphebis/core";

import type { CosyShopGaugeKey, CosyShopQuantityKey } from "./keys";

export type ShiftAmount = "slightly" | "moderately" | "strongly";

export const shiftAmountDeltas = {
  slightly: 0.1,
  moderately: 0.2,
  strongly: 0.3
} satisfies Record<ShiftAmount, number>;

export function increaseEntityGauge(
  entityId: EntityId,
  key: GaugeKey,
  amount: ShiftAmount
): Effect {
  return entityGauge(entityId, key, shiftAmountDeltas[amount]);
}

export function decreaseEntityGauge(
  entityId: EntityId,
  key: GaugeKey,
  amount: ShiftAmount
): Effect {
  return entityGauge(entityId, key, -shiftAmountDeltas[amount]);
}

export function gainQuantity(
  entityId: EntityId,
  key: QuantityKey,
  amount: number
): Effect {
  return entityQuantity(entityId, key, amount);
}

export function spendQuantity(
  entityId: EntityId,
  key: QuantityKey,
  amount: number
): Effect {
  return entityQuantity(entityId, key, -amount);
}

export const shop = {
  gainStock: (amount: number): Effect => gainCosyQuantity("shop", "stock", amount),
  spendStock: (amount: number): Effect => spendCosyQuantity("shop", "stock", amount),
  gainCoins: (amount: number): Effect => gainCosyQuantity("shop", "coins", amount),
  spendCoins: (amount: number): Effect => spendCosyQuantity("shop", "coins", amount),
  gainStanding: (amount: ShiftAmount): Effect =>
    increaseCosyEntityGauge("shop", "shopStanding", amount),
  loseStanding: (amount: ShiftAmount): Effect =>
    decreaseCosyEntityGauge("shop", "shopStanding", amount),
  gainGoodwill: (amount: ShiftAmount): Effect =>
    increaseCosyEntityGauge("shop", "goodwill", amount),
  loseGoodwill: (amount: ShiftAmount): Effect =>
    decreaseCosyEntityGauge("shop", "goodwill", amount)
};

export const player = {
  gainCompassion: (amount: ShiftAmount): Effect =>
    increaseCosyEntityGauge("player", "compassion", amount),
  loseCompassion: (amount: ShiftAmount): Effect =>
    decreaseCosyEntityGauge("player", "compassion", amount),
  gainPrudence: (amount: ShiftAmount): Effect =>
    increaseCosyEntityGauge("player", "prudence", amount),
  losePrudence: (amount: ShiftAmount): Effect =>
    decreaseCosyEntityGauge("player", "prudence", amount),
  gainFatigue: (amount: ShiftAmount): Effect =>
    increaseCosyEntityGauge("player", "fatigue", amount),
  recoverFatigue: (amount: ShiftAmount): Effect =>
    decreaseCosyEntityGauge("player", "fatigue", amount),
  gainAmbition: (amount: ShiftAmount): Effect =>
    increaseCosyEntityGauge("player", "ambition", amount),
  loseAmbition: (amount: ShiftAmount): Effect =>
    decreaseCosyEntityGauge("player", "ambition", amount)
};

export const apprentice = {
  gainConfidence: (amount: ShiftAmount): Effect =>
    increaseCosyEntityGauge("apprentice", "confidence", amount),
  loseConfidence: (amount: ShiftAmount): Effect =>
    decreaseCosyEntityGauge("apprentice", "confidence", amount),
  gainTrust: (amount: ShiftAmount): Effect =>
    increaseCosyEntityGauge("apprentice", "trust", amount),
  loseTrust: (amount: ShiftAmount): Effect =>
    decreaseCosyEntityGauge("apprentice", "trust", amount),
  gainAffection: (amount: ShiftAmount): Effect =>
    increaseCosyEntityGauge("apprentice", "affection", amount),
  loseAffection: (amount: ShiftAmount): Effect =>
    decreaseCosyEntityGauge("apprentice", "affection", amount),
  gainFear: (amount: ShiftAmount): Effect =>
    increaseCosyEntityGauge("apprentice", "fear", amount),
  loseFear: (amount: ShiftAmount): Effect =>
    decreaseCosyEntityGauge("apprentice", "fear", amount)
};

export const town = {
  gainGossipHeat: (amount: ShiftAmount): Effect =>
    increaseCosyEntityGauge("town", "gossipHeat", amount),
  loseGossipHeat: (amount: ShiftAmount): Effect =>
    decreaseCosyEntityGauge("town", "gossipHeat", amount)
};

export const scenes = {
  add: (sceneId: string): Effect => ({ kind: "addScene", sceneId }),
  remove: (sceneId: string): Effect => ({ kind: "removeScene", sceneId })
};

export const flags = {
  set: (key: string, value: boolean): Effect => ({ kind: "setFlag", key, value })
};

export function log(text: string): Effect {
  return { kind: "log", text };
}

function gainCosyQuantity(
  entityId: EntityId,
  key: CosyShopQuantityKey,
  amount: number
): Effect {
  return gainQuantity(entityId, key, amount);
}

function spendCosyQuantity(
  entityId: EntityId,
  key: CosyShopQuantityKey,
  amount: number
): Effect {
  return spendQuantity(entityId, key, amount);
}

function increaseCosyEntityGauge(
  entityId: EntityId,
  key: CosyShopGaugeKey,
  amount: ShiftAmount
): Effect {
  return increaseEntityGauge(entityId, key, amount);
}

function decreaseCosyEntityGauge(
  entityId: EntityId,
  key: CosyShopGaugeKey,
  amount: ShiftAmount
): Effect {
  return decreaseEntityGauge(entityId, key, amount);
}

function entityGauge(entityId: EntityId, key: GaugeKey, delta: number): Effect {
  return { kind: "entityGauge", entityId, key, delta };
}

function entityQuantity(entityId: EntityId, key: QuantityKey, delta: number): Effect {
  return { kind: "entityQuantity", entityId, key, delta };
}
