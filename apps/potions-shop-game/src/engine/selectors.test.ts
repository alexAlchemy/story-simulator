import { describe, expect, it } from "vitest";
import { createInitialState } from "../content/initialState";
import { changeEntityProperty, getNumericProperty } from "@aphebis/core";
import { getDashboardRows, getEntityCards } from "./selectors";
import { propertyDefinitions } from "@aphebis/system-cosy-shop";

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
      { key: "shopStanding", label: "Shop Standing", value: 0 }
    ]);
  });

  it("formats floating point display values without changing world state", () => {
    const state = changeEntityProperty(
      changeEntityProperty(
        createInitialState(),
        "player",
        "compassion",
        { direction: "increase", amount: 0.1 },
        propertyDefinitions.compassion
      ),
      "player",
      "compassion",
      { direction: "increase", amount: 0.2 },
      propertyDefinitions.compassion
    );

    expect(getNumericProperty(state, "player", "compassion")).toBe(0.30000000000000004);
    expect(getDashboardRows(state).find((row) => row.key === "compassion")).toMatchObject({
      value: 0.3
    });
    expect(
      getEntityCards(state, semanticContext)
        .find((card) => card.id === "player")
        ?.spectra.find((row) => row.key === "compassion")
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
      "town",
      "story"
    ]);
    expect(cards.find((card) => card.id === "shop")).toMatchObject({
      displayName: "The Potion Shop",
      kind: "shop",
      resources: [
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
    expect(cards.find((card) => card.id === "player")?.scales).toEqual([
      {
        key: "fatigue",
        label: "Fatigue",
        value: 0,
        semantic: {
          label: "Rested",
          description: "Clear-headed and physically steady."
        }
      }
    ]);
    expect(cards.find((card) => card.id === "player")?.spectra).toEqual([
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
    expect(
      cards
        .find((card) => card.id === "apprentice")
        ?.scales.find((row) => row.key === "confidence")
    ).toMatchObject({
      semantic: {
        label: "Unsure",
        description: "There is ability here, but hesitation too."
      }
    });
    expect(cards.find((card) => card.id === "town")?.scales[0]).toMatchObject({
      key: "gossipHeat",
      semantic: {
        label: "Murmuring",
        description: "A few people are talking, but the mood is still soft."
      }
    });
  });

});
