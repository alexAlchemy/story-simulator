import { describe, expect, it } from "vitest";
import { content } from "../content/scenes";
import { createInitialState } from "../content/initialState";
import { buildEnding } from "./buildEnding";
import { setEntityProperty } from "@aphebis/core";

describe("buildEnding", () => {
  it("reads rent outcome from world state and content rent amount", () => {
    const state = setEntityProperty(createInitialState(), "shop", "coins", 30);

    expect(buildEnding(state, content).shopOutcome).toContain(
      "count out 30 coins for rent"
    );
    expect(buildEnding(createInitialState(), content).shopOutcome).toContain(
      "short by 12 coins"
    );
  });
});
