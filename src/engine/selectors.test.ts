import { describe, expect, it } from "vitest";
import { createInitialState } from "../domain/initialState";
import { getDashboardRows } from "./selectors";

describe("selectors", () => {
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
});
