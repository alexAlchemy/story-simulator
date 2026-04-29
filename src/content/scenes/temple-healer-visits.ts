import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: The temple healer arrives with gratitude and a difficult question about your generosity.
 * The aftermath of mercy: can compassion become partnership, or does it only create debt?
 */
const scene: SceneCard = {
  id: "temple-healer-visits",
  title: "Temple Healer Visits",
  type: "town",
  description:
    "The temple healer arrives with gratitude, concern, and a question about how often you treat people for free.",
  coreQuestion: "Can generosity become a partnership instead of a leak in the ledger?",
  boons: [{ label: "Your mercy reached the temple before you did." }],
  banes: [{ label: "The temple cannot pay full market rates either." }],
  choices: [
    {
      id: "share-referrals",
      label: "Create a referral arrangement",
      effects: [
        { kind: "relationship", key: "townTrust", delta: 2 },
        { kind: "resource", key: "coins", delta: 4 },
        { kind: "value", key: "compassion", delta: 1 },
        { kind: "log", text: "The healer promises small payments, honest referrals, and fewer desperate surprises." }
      ]
    },
    {
      id: "keep-boundary",
      label: "Set a firm charity boundary",
      effects: [
        { kind: "value", key: "prudence", delta: 2 },
        { kind: "relationship", key: "townTrust", delta: 0 },
        { kind: "log", text: "The healer respects the answer, though neither of you enjoys it." }
      ]
    }
  ]
};

export default scene;
