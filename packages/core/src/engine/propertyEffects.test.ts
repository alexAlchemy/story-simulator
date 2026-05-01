import { describe, expect, it } from "vitest";
import type { GameContent, GameState, PropertyDefinition, Scene } from "../domain";
import { applyEffects } from "./applyEffects";
import { canSeeScene } from "./sceneAvailability";
import { getBooleanProperty, getNumericProperty } from "./worldAccess";

const propertyDefinitions = {
  coins: {
    key: "coins",
    kind: "quantity",
    label: "Coins",
    description: "Money on hand.",
    minimumValue: 0,
    changePolicy: { kind: "direct" }
  },
  trust: {
    key: "trust",
    kind: "scale",
    label: "Trust",
    description: "Trust in the player.",
    minimumValue: 0,
    maximumValue: 1,
    thresholds: [
      { rank: 0, min: 0, label: "Wary", description: "Not yet trusting." },
      { rank: 1, min: 0.5, label: "Trusting", description: "Willing to rely on you." },
      {
        rank: 2,
        min: 0.8,
        label: "Devoted",
        description: "Deeply loyal.",
        requiresMagnitude: "major"
      }
    ],
    changePolicy: {
      kind: "bounded",
      amounts: { small: 0.2, meaningful: 0.4, major: 0.5 }
    }
  },
  stance: {
    key: "stance",
    kind: "spectrum",
    label: "Stance",
    description: "A position between caution and boldness.",
    minimumValue: -1,
    maximumValue: 1,
    negativePole: { label: "Cautious", value: -1 },
    positivePole: { label: "Bold", value: 1 },
    thresholds: [
      { rank: 0, min: -1, label: "Cautious", description: "Avoids risk." },
      { rank: 1, min: -0.1, label: "Balanced", description: "In balance." },
      { rank: 2, min: 0.4, label: "Bold", description: "Accepts risk." }
    ],
    changePolicy: {
      kind: "bounded",
      amounts: { small: 0.2, meaningful: 0.4 }
    }
  },
  metApprentice: {
    key: "metApprentice",
    kind: "flag",
    label: "Met Apprentice",
    description: "The apprentice has been met."
  }
} satisfies Record<string, PropertyDefinition>;

describe("property effects", () => {
  it("sets and changes quantity, scale, spectrum, and flag properties", () => {
    const next = applyEffects(
      createState(),
      [
        {
          kind: "changeProperty",
          entityId: "shop",
          property: "coins",
          direction: "decrease",
          amount: 99
        },
        {
          kind: "changeProperty",
          entityId: "apprentice",
          property: "trust",
          direction: "increase",
          strength: "meaningful"
        },
        {
          kind: "changeProperty",
          entityId: "player",
          property: "stance",
          direction: "toward",
          pole: "Cautious",
          strength: "small"
        },
        {
          kind: "setProperty",
          entityId: "story",
          property: "metApprentice",
          value: true
        }
      ],
      { day: 1, propertyDefinitions }
    );

    expect(getNumericProperty(next, "shop", "coins")).toBe(0);
    expect(getNumericProperty(next, "apprentice", "trust")).toBe(0.4);
    expect(getNumericProperty(next, "player", "stance")).toBe(-0.2);
    expect(getBooleanProperty(next, "story", "metApprentice")).toBe(true);
  });

  it("blocks low-magnitude changes from crossing gated thresholds", () => {
    const state = setProperty(createState(), "apprentice", "trust", 0.7);

    const next = applyEffects(
      state,
      [
        {
          kind: "changeProperty",
          entityId: "apprentice",
          property: "trust",
          direction: "increase",
          strength: "meaningful",
          magnitude: "meaningful"
        }
      ],
      { day: 1, propertyDefinitions }
    );

    expect(getNumericProperty(next, "apprentice", "trust")).toBeLessThan(0.8);
  });

  it("matches property availability by value and semantic label", () => {
    const scene: Scene = {
      id: "test",
      title: "Test",
      type: "test",
      description: "A test scene.",
      availability: {
        all: [
          { kind: "property", entityId: "story", property: "metApprentice", value: true },
          { kind: "property", entityId: "apprentice", property: "trust", minLabel: "Trusting" }
        ]
      },
      choices: [{ id: "ok", label: "Ok", effects: [] }]
    };
    const content: GameContent = {
      scenes: { test: scene },
      dayPlan: {},
      endDay: 1,
      semantics: { propertyDefinitions }
    };
    const state = setProperty(
      setProperty(createState(), "story", "metApprentice", true),
      "apprentice",
      "trust",
      0.55
    );

    expect(canSeeScene(scene, state, content)).toBe(true);
  });
});

function createState(): GameState {
  return {
    day: 1,
    world: {
      entities: {
        player: {
          id: "player",
          kind: "person",
          displayName: "Player",
          tags: [],
          properties: { stance: 0 }
        },
        apprentice: {
          id: "apprentice",
          kind: "person",
          displayName: "Apprentice",
          tags: [],
          properties: { trust: 0 }
        },
        shop: {
          id: "shop",
          kind: "shop",
          displayName: "Shop",
          tags: [],
          properties: { coins: 10 }
        },
        story: {
          id: "story",
          kind: "story",
          displayName: "Story",
          tags: [],
          properties: {}
        }
      }
    },
    flags: {},
    sceneTableau: [],
    resolvedScenes: [],
    log: [],
    ended: false
  };
}

function setProperty(
  state: GameState,
  entityId: string,
  property: string,
  value: number | boolean
): GameState {
  const entity = state.world.entities[entityId];
  return {
    ...state,
    world: {
      ...state.world,
      entities: {
        ...state.world.entities,
        [entityId]: {
          ...entity,
          properties: {
            ...entity.properties,
            [property]: value
          }
        }
      }
    }
  };
}

