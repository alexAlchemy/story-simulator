import type { SceneCard } from "../../domain/types";

/**
 * PREMISE: An old hedge-witch admits the moonleaf was hers—a test of what you do with unpriced kindness.
 * Building connection through judgment: can a relationship that begins as a test become genuine?
 */
const scene: SceneCard = {
  id: "gift-giver-revealed",
  title: "The Gift Giver Revealed",
  type: "town",
  description:
    "An old hedge-witch admits the moonleaf was hers. She wanted to know what you do with unpriced kindness.",
  coreQuestion: "Do you accept a relationship that begins as a test?",
  boons: [{ label: "She knows suppliers nobody else trusts." }],
  banes: [{ label: "She has already judged you once." }],
  choices: [
    {
      id: "accept-mentor",
      label: "Accept her strange mentorship",
      effects: [
        { kind: "resource", key: "stock", delta: 2 },
        { kind: "relationship", key: "townTrust", delta: 1 },
        { kind: "value", key: "prudence", delta: 1 },
        { kind: "log", text: "She laughs when you ask for clearer terms, which is almost an answer." }
      ]
    },
    {
      id: "decline-test",
      label: "Decline the relationship",
      effects: [
        { kind: "value", key: "ambition", delta: 1 },
        { kind: "relationship", key: "townTrust", delta: -1 },
        {
          kind: "log",
          text: "She respects the refusal, perhaps more than she would have respected obedience."
        }
      ]
    }
  ]
};

export default scene;
