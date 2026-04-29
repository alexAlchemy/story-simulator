import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: The shop sign hangs crooked. Fixing it won't pay rent. But neglect has its own language.
 * Care beyond necessity: what does it cost to tend something just because it matters?
 */
const scene: SceneCard = {
  id: "quiet-repair-sign",
  title: "Quiet Moment: Repairing the Sign",
  type: "reflection",
  description:
    "The shop sign hangs crooked. Fixing it will not pay rent, but neglect has its own language.",
  coreQuestion: "What does care look like when nobody is asking for it?",
  boons: [{ label: "A better sign may draw kinder attention." }],
  banes: [{ label: "Time spent here is time not brewing." }],
  choices: [
    {
      id: "repair-carefully",
      label: "Repair it carefully",
      effects: [
        { kind: "relationship", key: "townTrust", delta: 1 },
        { kind: "value", key: "compassion", delta: 1 },
        { kind: "resource", key: "fatigue", delta: 1 },
        { kind: "log", text: "By dusk, the painted mortar and pestle swings straight again." }
      ]
    },
    {
      id: "paint-bold",
      label: "Paint it brighter",
      effects: [
        { kind: "resource", key: "coins", delta: 4 },
        { kind: "value", key: "ambition", delta: 1 },
        { kind: "log", text: "Two new customers find you before supper." }
      ]
    }
  ]
};

export default scene;
