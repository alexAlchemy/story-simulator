import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: A well-paying courier offers excellent coin for a rush order that will deplete your stock.
 * Ambition versus prudence: can you chase profit without gambling on the town's needs?
 */
const scene: SceneCard = {
  id: "moon-tonic-order",
  title: "Brew Under Pressure: Moon-Tonic Order",
  type: "brew",
  description:
    "An observatory courier needs a Moon-Tonic before nightfall. The pay is excellent, but the brew will consume useful stock.",
  coreQuestion: "Do you chase a profitable order when the town may need those ingredients later?",
  boons: [{ label: "The recipe is familiar." }, { label: "The courier can pay well." }],
  banes: [{ label: "Fatigue is rising." }, { label: "Ordinary customers may need those ingredients." }],
  choices: [
    {
      id: "careful-full-price",
      label: "Brew carefully and charge full price",
      effects: [
        { kind: "resource", key: "stock", delta: -1 },
        { kind: "resource", key: "coins", delta: 12 },
        { kind: "resource", key: "fatigue", delta: 1 },
        { kind: "value", key: "ambition", delta: 1 },
        { kind: "log", text: "The Moon-Tonic clears silver in the vial, and the courier pays without haggling." }
      ]
    },
    {
      id: "ask-apprentice",
      label: "Ask the apprentice to help",
      description: "Share the work and the risk.",
      effects: [
        { kind: "resource", key: "stock", delta: -1 },
        { kind: "resource", key: "coins", delta: 10 },
        { kind: "relationship", key: "apprenticeTrust", delta: 1 },
        { kind: "value", key: "compassion", delta: 1 },
        { kind: "addScene", sceneId: "apprentice-asks-trust" },
        { kind: "log", text: "Your apprentice steadies the flame, glowing with the terror of being useful." }
      ]
    },
    {
      id: "decline",
      label: "Decline and preserve stock",
      effects: [
        { kind: "value", key: "prudence", delta: 2 },
        { kind: "relationship", key: "townTrust", delta: -1 },
        { kind: "log", text: "The courier leaves for a rival shop, but your shelves remain less bare." }
      ]
    }
  ]
};

export default scene;
