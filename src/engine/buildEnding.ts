import type { EndingSummary, GameState } from "../domain/types";

export function buildEnding(state: GameState): EndingSummary {
  const paidRent = state.resources.coins >= 30;
  const dominantValue = getDominantValue(state);

  return {
    title: paidRent ? "The Door Opens Again" : "The Rent Bell Rings",
    shopOutcome: paidRent
      ? `You count out 30 coins for rent and keep ${state.resources.coins - 30} behind the counter. The shop survives the week.`
      : `You are short by ${30 - state.resources.coins} coins. The landlord leaves with a promise, a warning, or both.`,
    identityOutcome: identityText(dominantValue),
    relationshipOutcome:
      state.relationships.apprenticeTrust >= 2
        ? "Your apprentice stays late without being asked, trusting that this place can become kinder than the week was."
        : state.relationships.apprenticeTrust <= -2
          ? "Your apprentice avoids your eyes while sweeping, and the quiet between you feels expensive."
          : "Your apprentice remains, uncertain but watching closely what kind of shopkeeper you are becoming.",
    futureHook:
      state.relationships.townTrust >= 2
        ? "By morning, someone has left bread, lavender, and a new problem on the step."
        : "By morning, the town knows your door is still there, but not yet whether it is open to them."
  };
}

function getDominantValue(state: GameState): keyof GameState["values"] {
  return Object.entries(state.values).sort((a, b) => b[1] - a[1])[0][0] as keyof GameState["values"];
}

function identityText(value: keyof GameState["values"]): string {
  if (value === "compassion") {
    return "Mercy became your strongest habit. It cost you, but people learned your counter was not only a till.";
  }

  if (value === "ambition") {
    return "You chased the bigger chance when it appeared. The shop feels sharper now, brighter, and less innocent.";
  }

  return "Prudence kept your hands steady. You learned which losses to refuse, even when refusal had a face.";
}
