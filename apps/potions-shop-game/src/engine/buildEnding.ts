import type { GameContent, GameState } from "@aphebis/core";
import { getEntityGauge, getEntityQuantity } from "@aphebis/core";
import type { CosyShopGaugeKey } from "@aphebis/system-cosy-shop";

export type EndingSummary = {
  title: string;
  shopOutcome: string;
  identityOutcome: string;
  socialOutcome: string;
  futureHook: string;
};

type EndingContent = GameContent & {
  rentAmount: number;
};

export function buildEnding(state: GameState, content: EndingContent): EndingSummary {
  const coins = getEntityQuantity(state, "shop", "coins");
  const paidRent = coins >= content.rentAmount;
  const dominantValue = getDominantValue(state);
  const apprenticeTrust = getEntityGauge(state, "apprentice", "trust");
  const shopStanding = getEntityGauge(state, "shop", "shopStanding");

  return {
    title: paidRent ? "The Door Opens Again" : "The Rent Bell Rings",
    shopOutcome: paidRent
      ? `You count out ${content.rentAmount} coins for rent and keep ${coins - content.rentAmount} behind the counter. The shop survives the week.`
      : `You are short by ${content.rentAmount - coins} coins. The landlord leaves with a promise, a warning, or both.`,
    identityOutcome: identityText(dominantValue),
    socialOutcome:
      apprenticeTrust >= 0.2
        ? "Your apprentice stays late without being asked, trusting that this place can become kinder than the week was."
        : apprenticeTrust < 0
          ? "Your apprentice avoids your eyes while sweeping, and the quiet between you feels expensive."
          : "Your apprentice remains, uncertain but watching closely what kind of shopkeeper you are becoming.",
    futureHook:
      shopStanding >= 0.2
        ? "By morning, someone has left bread, lavender, and a new problem on the step."
        : "By morning, the town knows your door is still there, but not yet whether it is open to them."
  };
}

type IdentityGaugeKey = Extract<CosyShopGaugeKey, "compassion" | "prudence" | "ambition">;

function getDominantValue(state: GameState): IdentityGaugeKey {
  const values = [
    ["compassion", getEntityGauge(state, "player", "compassion")],
    ["prudence", getEntityGauge(state, "player", "prudence")],
    ["ambition", getEntityGauge(state, "player", "ambition")]
  ] as const;

  return [...values].sort((a, b) => b[1] - a[1])[0][0];
}

function identityText(value: IdentityGaugeKey): string {
  if (value === "compassion") {
    return "Mercy became your strongest habit. It cost you, but people learned your counter was not only a till.";
  }

  if (value === "ambition") {
    return "You chased the bigger chance when it appeared. The shop feels sharper now, brighter, and less innocent.";
  }

  return "Prudence kept your hands steady. You learned which losses to refuse, even when refusal had a face.";
}
