import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: Midnight arrives. The shop is quiet. You count the coins twice and the number stays wrong.
 * A private reckoning: what does survival cost when measured in sleep, work, and self-care?
 */
const scene: SceneCard = {
  id: "counting-coins",
  title: "Counting Coins at Midnight",
  type: "reflection",
  description:
    "The shop is quiet. Rain taps the window. You count the coins twice and still imagine the rent bell.",
  coreQuestion: "What does security cost you?",
  boons: [{ label: "A clear ledger can calm the heart." }],
  banes: [{ label: "Every plan costs either time, pride, or sleep." }],
  choices: [
    {
      id: "raise-prices-tomorrow",
      label: "Plan to raise prices tomorrow",
      effects: [
        { kind: "value", key: "prudence", delta: 1 },
        { kind: "addScene", sceneId: "raise-prices" },
        { kind: "log", text: "You mark three prices in darker ink and do not sleep immediately after." }
      ]
    },
    {
      id: "work-late",
      label: "Work late bottling simple remedies",
      effects: [
        { kind: "resource", key: "stock", delta: 1 },
        { kind: "resource", key: "fatigue", delta: 2 },
        { kind: "value", key: "ambition", delta: 1 },
        { kind: "log", text: "By candle-end, six labels are straight and your hands ache." }
      ]
    },
    {
      id: "rest",
      label: "Close your eyes and rest",
      effects: [
        { kind: "resource", key: "fatigue", delta: -2 },
        { kind: "value", key: "compassion", delta: 1 },
        { kind: "log", text: "For one night, you treat yourself like someone worth preserving." }
      ]
    }
  ]
};

export default scene;
