import type { GameState } from "../domain/types";
import {
  getEntityGauge,
  getEntityQuantity,
  getRelationshipDimension
} from "./worldAccess";

export type DashboardRow = {
  key: string;
  label: string;
  value: number;
};

export function getResourceRows(state: GameState): DashboardRow[] {
  return [
    { key: "coins", label: "Coins", value: getEntityQuantity(state, "shop", "coins") },
    { key: "stock", label: "Stock", value: getEntityQuantity(state, "shop", "stock") },
    {
      key: "fatigue",
      label: "Fatigue",
      value: getEntityGauge(state, "player", "fatigue")
    }
  ];
}

export function getValueRows(state: GameState): DashboardRow[] {
  return [
    {
      key: "compassion",
      label: "Compassion",
      value: getEntityGauge(state, "player", "compassion")
    },
    {
      key: "prudence",
      label: "Prudence",
      value: getEntityGauge(state, "player", "prudence")
    },
    {
      key: "ambition",
      label: "Ambition",
      value: getEntityGauge(state, "player", "ambition")
    }
  ];
}

export function getRelationshipRows(state: GameState): DashboardRow[] {
  return [
    {
      key: "apprenticeTrust",
      label: "Apprentice Trust",
      value: getRelationshipDimension(state, "apprentice->player", "trust")
    },
    {
      key: "townTrust",
      label: "Town Trust",
      value: getRelationshipDimension(state, "town->shop", "trust")
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
