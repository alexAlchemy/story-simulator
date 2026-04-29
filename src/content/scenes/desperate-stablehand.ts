import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: A soaked stranger arrives at closing with three copper coins and a dying sister.
 * The shop's first test: does a potion shop serve the desperate, or just those who can pay?
 */
const scene: SceneCard = {
  id: "desperate-stablehand",
  title: "The Desperate Stablehand",
  type: "customer",
  description:
    "A soaked stablehand arrives near closing. His little sister has a fever, and he has only three copper coins.",
  coreQuestion: "Is your shop a business, a refuge, or something in between?",
  boons: [{ label: "You have one fever draught already brewed." }],
  banes: [{ label: "Stock is low." }, { label: "Rent is due soon." }],
  choices: [
    {
      id: "free-draught",
      label: "Give him the draught for free",
      description: "Let need matter more than the till.",
      effects: [
        { kind: "resource", key: "stock", delta: -1 },
        { kind: "value", key: "compassion", delta: 2 },
        { kind: "relationship", key: "townTrust", delta: 1 },
        { kind: "setFlag", key: "stablehand_grateful", value: true },
        { kind: "addScene", sceneId: "temple-healer-visits" },
        { kind: "log", text: "The stablehand leaves clutching the draught like a candle in the rain." }
      ]
    },
    {
      id: "sell-for-three",
      label: "Take his three coins",
      description: "Help him, but keep the sale recorded.",
      effects: [
        { kind: "resource", key: "stock", delta: -1 },
        { kind: "resource", key: "coins", delta: 3 },
        { kind: "value", key: "prudence", delta: 1 },
        { kind: "value", key: "compassion", delta: 1 },
        { kind: "relationship", key: "townTrust", delta: 1 },
        { kind: "log", text: "Three wet coins land in the drawer, lighter than they should feel." }
      ]
    },
    {
      id: "refuse",
      label: "Refuse the sale",
      description: "You cannot keep the doors open by giving away what you need.",
      effects: [
        { kind: "value", key: "prudence", delta: 2 },
        { kind: "relationship", key: "townTrust", delta: -1 },
        { kind: "setFlag", key: "stablehand_refused", value: true },
        { kind: "addScene", sceneId: "rumour-at-market" },
        { kind: "log", text: "He nods once, too politely, and the bell over the door sounds colder." }
      ]
    }
  ]
};

export default scene;
