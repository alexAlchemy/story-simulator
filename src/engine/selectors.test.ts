import { describe, expect, it } from "vitest";
import { createInitialState } from "../domain/initialState";
import { adjustEntityGauge } from "./worldAccess";
import { getDashboardRows, getEntityCards, getRelationshipCards } from "./selectors";

describe("selectors", () => {
  const semanticContext = {
    rentAmount: 30,
    expectedDemand: 4
  };

  it("builds dashboard rows from world state", () => {
    const rows = getDashboardRows(createInitialState());

    expect(rows).toEqual([
      { key: "coins", label: "Coins", value: 18 },
      { key: "stock", label: "Stock", value: 3 },
      { key: "fatigue", label: "Fatigue", value: 0 },
      { key: "compassion", label: "Compassion", value: 0 },
      { key: "prudence", label: "Prudence", value: 0 },
      { key: "ambition", label: "Ambition", value: 0 },
      { key: "apprenticeTrust", label: "Apprentice Trust", value: 0 },
      { key: "townTrust", label: "Town Trust", value: 0 }
    ]);
  });

  it("formats floating point display values without changing world state", () => {
    const state = adjustEntityGauge(
      adjustEntityGauge(createInitialState(), "player", "compassion", 0.1),
      "player",
      "compassion",
      0.2
    );

    expect(state.world.entities.player.gauges.compassion).toBe(0.30000000000000004);
    expect(getDashboardRows(state).find((row) => row.key === "compassion")).toMatchObject({
      value: 0.3
    });
    expect(
      getEntityCards(state, semanticContext)
        .find((card) => card.id === "player")
        ?.gauges.find((row) => row.key === "compassion")
    ).toMatchObject({
      value: 0.3
    });
  });

  it("builds entity cards from every world entity", () => {
    const cards = getEntityCards(createInitialState(), semanticContext);

    expect(cards.map((card) => card.id)).toEqual([
      "player",
      "shop",
      "apprentice",
      "town"
    ]);
    expect(cards.find((card) => card.id === "shop")).toMatchObject({
      displayName: "The Potion Shop",
      kind: "shop",
      quantities: [
        {
          key: "coins",
          label: "Coins",
          value: 18,
          semantic: {
            label: "Close",
            description: "The shop is near the target, but not comfortably past it."
          }
        },
        {
          key: "stock",
          label: "Stock",
          value: 3,
          semantic: {
            label: "Manageable",
            description: "The stock can cover routine demand for now."
          }
        }
      ]
    });
    expect(cards.find((card) => card.id === "player")?.gauges).toEqual([
      {
        key: "fatigue",
        label: "Fatigue",
        value: 0,
        semantic: {
          label: "Rested",
          description: "Clear-headed and physically steady."
        }
      },
      {
        key: "compassion",
        label: "Compassion",
        value: 0,
        semantic: {
          label: "Neutral",
          description: "Compassion and detachment are still in ordinary balance."
        }
      },
      {
        key: "prudence",
        label: "Prudence",
        value: 0,
        semantic: {
          label: "Neutral",
          description: "Prudence and impulse are still in ordinary balance."
        }
      },
      {
        key: "ambition",
        label: "Ambition",
        value: 0,
        semantic: {
          label: "Neutral",
          description: "Ambition and contentment are still in ordinary balance."
        }
      }
    ]);
    expect(cards.find((card) => card.id === "apprentice")?.gauges[0]).toMatchObject({
      key: "confidence",
      semantic: {
        label: "Unsure",
        description: "There is ability here, but hesitation too."
      }
    });
    expect(cards.find((card) => card.id === "town")?.gauges[0]).toMatchObject({
      key: "gossipHeat",
      semantic: {
        label: "Murmuring",
        description: "A few people are talking, but the mood is still soft."
      }
    });
  });

  it("builds relationship cards with entity display names", () => {
    const cards = getRelationshipCards(createInitialState(), semanticContext);

    expect(cards).toEqual([
      {
        id: "apprentice->player",
        from: "The Apprentice",
        to: "The Shopkeeper",
        dimensions: [
          {
            key: "trust",
            label: "Trust",
            value: 0,
            semantic: {
              label: "Distrustful",
              description: "The bond is guarded and uncertain."
            }
          },
          {
            key: "affection",
            label: "Affection",
            value: 0,
            semantic: {
              label: "Cool",
              description: "There is little personal warmth here."
            }
          },
          {
            key: "fear",
            label: "Fear",
            value: 0,
            semantic: {
              label: "Unafraid",
              description: "Fear is not shaping the relationship."
            }
          }
        ],
        flags: [],
        tokens: []
      },
      {
        id: "town->shop",
        from: "Briarwick",
        to: "The Potion Shop",
        dimensions: [
          {
            key: "trust",
            label: "Trust",
            value: 0,
            semantic: {
              label: "Distrustful",
              description: "The bond is guarded and uncertain."
            }
          },
          {
            key: "goodwill",
            label: "Goodwill",
            value: 0,
            semantic: {
              label: "Indifferent",
              description: "There is little active goodwill to draw on."
            }
          }
        ],
        flags: [],
        tokens: []
      }
    ]);
  });
});
