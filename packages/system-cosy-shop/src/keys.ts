export type CosyShopScalePropertyKey =
  | "fatigue"
  | "confidence"
  | "gossipHeat"
  | "trust"
  | "affection"
  | "fear"
  | "shopStanding"
  | "goodwill";

export type CosyShopSpectrumPropertyKey = "compassion" | "prudence" | "ambition";

export type CosyShopQuantityPropertyKey = "coins" | "stock";

export type CosyShopFlagPropertyKey =
  | "stablehand_helped"
  | "stablehand_grateful"
  | "stablehand_refused"
  | "mistake_handled_gently"
  | "mysterious_gift_accepted"
  | "left_thanks_for_gift";

export type CosyShopPropertyKey =
  | CosyShopScalePropertyKey
  | CosyShopSpectrumPropertyKey
  | CosyShopQuantityPropertyKey
  | CosyShopFlagPropertyKey;
