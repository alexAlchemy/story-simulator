import type { EntityState, GameState } from "@aphebis/core";
import {
  describeBoundedGauge,
  describeOpenQuantity,
  describeSignedGauge,
  type SemanticValue
} from "@aphebis/core";
import {
  coinsDefinition,
  entityGaugeDefinitions,
  relationshipDimensionDefinitions,
  stockDefinition
} from "@aphebis/system-cosy-shop";
import {
  getEntityGauge,
  getEntityQuantity,
  getRelationshipDimension
} from "@aphebis/core";

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
  gauges: StateRow[];
  quantities: StateRow[];
  flags: StateRow[];
};

export type RelationshipCardViewModel = {
  id: string;
  from: string;
  to: string;
  dimensions: StateRow[];
  flags: StateRow[];
};

export function getResourceRows(state: GameState): DashboardRow[] {
  return [
    {
      key: "coins",
      label: "Coins",
      value: formatNumericValue(getEntityQuantity(state, "shop", "coins"))
    },
    {
      key: "stock",
      label: "Stock",
      value: formatNumericValue(getEntityQuantity(state, "shop", "stock"))
    },
    {
      key: "fatigue",
      label: "Fatigue",
      value: formatNumericValue(getEntityGauge(state, "player", "fatigue"))
    }
  ];
}

export function getValueRows(state: GameState): DashboardRow[] {
  return [
    {
      key: "compassion",
      label: "Compassion",
      value: formatNumericValue(getEntityGauge(state, "player", "compassion"))
    },
    {
      key: "prudence",
      label: "Prudence",
      value: formatNumericValue(getEntityGauge(state, "player", "prudence"))
    },
    {
      key: "ambition",
      label: "Ambition",
      value: formatNumericValue(getEntityGauge(state, "player", "ambition"))
    }
  ];
}

export function getRelationshipRows(state: GameState): DashboardRow[] {
  return [
    {
      key: "apprenticeTrust",
      label: "Apprentice Trust",
      value: formatNumericValue(
        getRelationshipDimension(state, "apprentice->player", "trust")
      )
    },
    {
      key: "townTrust",
      label: "Town Trust",
      value: formatNumericValue(getRelationshipDimension(state, "town->shop", "trust"))
    }
  ];
}

export function getDashboardRows(state: GameState): DashboardRow[] {
  return [
    ...getResourceRows(state),
    ...getValueRows(state),
    ...getRelationshipRows(state)
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
    gauges: toStateRows(entity.gauges, semanticContext),
    quantities: toStateRows(entity.quantities, semanticContext),
    flags: toStateRows(entity.flags)
  }));
}

export function getRelationshipCards(
  state: GameState,
  semanticContext: WorldStateSemanticContext
): RelationshipCardViewModel[] {
  return Object.values(state.world.relationships).map((relationship) => ({
    id: relationship.id,
    from: state.world.entities[relationship.from]?.displayName ?? relationship.from,
    to: state.world.entities[relationship.to]?.displayName ?? relationship.to,
    dimensions: toStateRows(relationship.dimensions, semanticContext),
    flags: toStateRows(relationship.flags)
  }));
}

function toStateRows(
  values: Record<string, string | number | boolean | undefined>,
  semanticContext?: WorldStateSemanticContext
): StateRow[] {
  return Object.entries(values)
    .filter((entry): entry is [string, string | number | boolean] => entry[1] !== undefined)
    .map(([key, value]) => ({
      key,
      label: formatStateLabel(key),
      value: typeof value === "number" ? formatNumericValue(value) : value,
      semantic:
        typeof value === "number" && semanticContext
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
  const boundedDefinition =
    entityGaugeDefinitions[key as keyof typeof entityGaugeDefinitions] ??
    relationshipDimensionDefinitions[key as keyof typeof relationshipDimensionDefinitions];

  if (boundedDefinition?.family === "boundedGauge") {
    return describeBoundedGauge(boundedDefinition, value);
  }

  if (boundedDefinition?.family === "signedGauge") {
    return describeSignedGauge(boundedDefinition, value);
  }

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
      return undefined;
  }
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
