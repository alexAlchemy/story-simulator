import type { EntityState, GameState, PropertyDefinition, PropertyThreshold } from "@aphebis/core";
import {
  describeOpenQuantity,
  getNumericProperty,
  type SemanticValue
} from "@aphebis/core";
import {
  coinsDefinition,
  propertyDefinitions as cosyShopPropertyDefinitions,
  stockDefinition
} from "@aphebis/system-cosy-shop";

const propertyDefinitions: Record<string, PropertyDefinition> = cosyShopPropertyDefinitions;

export type DashboardRow = {
  key: string;
  label: string;
  value: number;
};

export type StateRow = {
  key: string;
  label: string;
  value: string | number | boolean;
  semantic?: {
    label: string;
    description: string;
  };
};

export type WorldStateSemanticContext = {
  rentAmount: number;
  expectedDemand: number;
};

export type EntityCardViewModel = {
  id: string;
  displayName: string;
  kind: EntityState["kind"];
  tags: string[];
  quantities: StateRow[];
  scales: StateRow[];
  spectra: StateRow[];
  flags: StateRow[];
};

export function getResourceRows(state: GameState): DashboardRow[] {
  return [
    {
      key: "coins",
      label: "Coins",
      value: formatNumericValue(getNumericProperty(state, "shop", "coins"))
    },
    {
      key: "stock",
      label: "Stock",
      value: formatNumericValue(getNumericProperty(state, "shop", "stock"))
    },
    {
      key: "fatigue",
      label: "Fatigue",
      value: formatNumericValue(getNumericProperty(state, "player", "fatigue"))
    }
  ];
}

export function getValueRows(state: GameState): DashboardRow[] {
  return [
    {
      key: "compassion",
      label: "Compassion",
      value: formatNumericValue(getNumericProperty(state, "player", "compassion"))
    },
    {
      key: "prudence",
      label: "Prudence",
      value: formatNumericValue(getNumericProperty(state, "player", "prudence"))
    },
    {
      key: "ambition",
      label: "Ambition",
      value: formatNumericValue(getNumericProperty(state, "player", "ambition"))
    }
  ];
}

export function getStandingRows(state: GameState): DashboardRow[] {
  return [
    {
      key: "apprenticeTrust",
      label: "Apprentice Trust",
      value: formatNumericValue(getNumericProperty(state, "apprentice", "trust"))
    },
    {
      key: "shopStanding",
      label: "Shop Standing",
      value: formatNumericValue(getNumericProperty(state, "shop", "shopStanding"))
    }
  ];
}

export function getDashboardRows(state: GameState): DashboardRow[] {
  return [
    ...getResourceRows(state),
    ...getValueRows(state),
    ...getStandingRows(state)
  ];
}

export function getEntityCards(
  state: GameState,
  semanticContext: WorldStateSemanticContext
): EntityCardViewModel[] {
  return Object.values(state.world.entities).map((entity) => ({
    id: entity.id,
    displayName: entity.displayName,
    kind: entity.kind,
    tags: [...entity.tags],
    quantities: toStateRows(entity.properties, semanticContext, "quantity"),
    scales: toStateRows(entity.properties, semanticContext, "scale"),
    spectra: toStateRows(entity.properties, semanticContext, "spectrum"),
    flags: toStateRows(entity.properties, semanticContext, "flag")
  }));
}

function toStateRows(
  values: Record<string, string | number | boolean | undefined>,
  semanticContext: WorldStateSemanticContext,
  kind: PropertyDefinition["kind"]
): StateRow[] {
  return Object.entries(values)
    .filter((entry): entry is [string, string | number | boolean] => {
      const [key, value] = entry;
      return value !== undefined && propertyDefinitions[key]?.kind === kind;
    })
    .map(([key, value]) => ({
      key,
      label: propertyDefinitions[key]?.label ?? formatStateLabel(key),
      value: typeof value === "number" ? formatNumericValue(value) : value,
      semantic:
        typeof value === "number"
          ? describeSemanticStateValue(key, value, semanticContext)
          : undefined
    }));
}

function describeSemanticStateValue(
  key: string,
  value: number,
  semanticContext: WorldStateSemanticContext
): StateRow["semantic"] {
  const semanticValue = getSemanticValue(key, value, semanticContext);

  if (!semanticValue) {
    return undefined;
  }

  return {
    label: formatStateLabel(semanticValue.label),
    description: semanticValue.description
  };
}

function getSemanticValue(
  key: string,
  value: number,
  semanticContext: WorldStateSemanticContext
): SemanticValue | undefined {
  const definition = propertyDefinitions[key as keyof typeof propertyDefinitions];

  switch (key) {
    case "coins":
      return describeOpenQuantity(coinsDefinition, value, {
        rentAmount: semanticContext.rentAmount
      });
    case "stock":
      return describeOpenQuantity(stockDefinition, value, {
        expectedDemand: semanticContext.expectedDemand
      });
    default:
      break;
  }

  if (hasThresholds(definition)) {
    const selected = [...definition.thresholds]
      .reverse()
      .find((threshold) => value >= threshold.min) ?? definition.thresholds[0];
    return {
      key,
      value,
      label: selected.label,
      rank: selected.rank,
      description: selected.description
    };
  }

  return undefined;
}

function hasThresholds(
  definition: PropertyDefinition | undefined
): definition is PropertyDefinition & { thresholds: readonly PropertyThreshold[] } {
  return Boolean(
    definition &&
      "thresholds" in definition &&
      Array.isArray(definition.thresholds) &&
      definition.thresholds.length > 0
  );
}

function formatStateLabel(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatNumericValue(value: number): number {
  return Number(value.toFixed(3));
}
