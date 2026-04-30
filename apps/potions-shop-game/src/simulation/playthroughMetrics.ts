import type {
  GameContent,
  GameState,
  SceneCard,
  SceneChoice
} from "@aphebis/core";
import { createInitialState } from "../content/initialState";
import { advanceDay } from "@aphebis/core";
import { resolveChoice } from "@aphebis/core";
import { getVisibleScenes } from "@aphebis/core";
import {
  getEntityGauge,
  getEntityQuantity,
  getRelationshipDimension
} from "@aphebis/core";

export type StateMetricSnapshot = {
  resources: {
    coins: number;
    stock: number;
    fatigue: number;
  };
  relationships: {
    apprenticeTrust: number;
    townTrust: number;
  };
  values: {
    compassion: number;
    prudence: number;
    ambition: number;
  };
};

export type TurnSnapshot = StateMetricSnapshot & {
  turn: number;
  day: number;
  sceneId?: string;
  choiceId?: string;
};

export type AverageTurnMetrics = StateMetricSnapshot & {
  turn: number;
  runCount: number;
  averageDay: number;
};

export type PlaythroughRunSummary = {
  id: string;
  finalState: GameState;
  snapshots: TurnSnapshot[];
};

export type PlaythroughMetricsReport = {
  runCount: number;
  runs: PlaythroughRunSummary[];
  averageByTurn: AverageTurnMetrics[];
  finalAverage: StateMetricSnapshot;
};

export type PlaythroughMetricsOptions = {
  runs?: number;
  rng?: () => number;
  createState?: () => GameState;
};

const DEFAULT_RUNS = 1000;
const MAX_SIMULATION_STEPS = 200;

export function simulatePlaythroughMetrics(
  content: GameContent,
  options: PlaythroughMetricsOptions = {}
): PlaythroughMetricsReport {
  const runCount = options.runs ?? DEFAULT_RUNS;
  const rng = options.rng ?? Math.random;
  const createState = options.createState ?? createInitialState;
  const runs = Array.from({ length: runCount }, (_, index) =>
    simulatePlaythroughRun(`run-${index + 1}`, content, createState(), rng)
  );

  return {
    runCount,
    runs,
    averageByTurn: averageSnapshotsByTurn(runs),
    finalAverage: averageStateMetrics(runs.map((run) => run.finalState))
  };
}

function simulatePlaythroughRun(
  runId: string,
  content: GameContent,
  initialState: GameState,
  rng: () => number
): PlaythroughRunSummary {
  let state = initialState;
  let turn = 0;
  let steps = 0;
  const snapshots: TurnSnapshot[] = [snapshotState(state, turn)];

  while (!state.ended && steps < MAX_SIMULATION_STEPS) {
    const visibleScenes = getVisibleScenes(state, content);

    if (visibleScenes.length === 0) {
      state = advanceDay(state, content);
      steps += 1;
      continue;
    }

    const scene = pickOne(visibleScenes, rng);
    const choice = pickOne(scene.choices, rng);

    state = resolveChoice(state, scene.id, choice.id, content);
    turn += 1;
    snapshots.push(snapshotState(state, turn, scene, choice));
    steps += 1;
  }

  if (steps >= MAX_SIMULATION_STEPS) {
    throw new Error(`Simulation exceeded ${MAX_SIMULATION_STEPS} steps`);
  }

  return {
    id: runId,
    finalState: state,
    snapshots
  };
}

function snapshotState(
  state: GameState,
  turn: number,
  scene?: SceneCard,
  choice?: SceneChoice
): TurnSnapshot {
  return {
    turn,
    day: state.day,
    sceneId: scene?.id,
    choiceId: choice?.id,
    resources: {
      coins: getEntityQuantity(state, "shop", "coins"),
      stock: getEntityQuantity(state, "shop", "stock"),
      fatigue: getEntityGauge(state, "player", "fatigue")
    },
    relationships: {
      apprenticeTrust: getRelationshipDimension(
        state,
        "apprentice->player",
        "trust"
      ),
      townTrust: getRelationshipDimension(state, "town->shop", "trust")
    },
    values: {
      compassion: getEntityGauge(state, "player", "compassion"),
      prudence: getEntityGauge(state, "player", "prudence"),
      ambition: getEntityGauge(state, "player", "ambition")
    }
  };
}

function averageSnapshotsByTurn(
  runs: PlaythroughRunSummary[]
): AverageTurnMetrics[] {
  const maxTurn = Math.max(...runs.map((run) => run.snapshots.at(-1)?.turn ?? 0));
  const averages: AverageTurnMetrics[] = [];

  for (let turn = 0; turn <= maxTurn; turn += 1) {
    const snapshots = runs
      .map((run) => run.snapshots[turn])
      .filter((snapshot): snapshot is TurnSnapshot => Boolean(snapshot));

    averages.push({
      turn,
      runCount: snapshots.length,
      averageDay:
        snapshots.reduce((total, snapshot) => total + snapshot.day, 0) /
        snapshots.length,
      ...averageMetricSnapshots(snapshots)
    });
  }

  return averages;
}

function averageStateMetrics(states: GameState[]): StateMetricSnapshot {
  return averageMetricSnapshots(states.map((state) => snapshotState(state, 0)));
}

function averageMetricSnapshots(snapshots: StateMetricSnapshot[]): StateMetricSnapshot {
  return {
    resources: {
      coins: average(snapshots, (snapshot) => snapshot.resources.coins),
      stock: average(snapshots, (snapshot) => snapshot.resources.stock),
      fatigue: average(snapshots, (snapshot) => snapshot.resources.fatigue)
    },
    relationships: {
      apprenticeTrust: average(
        snapshots,
        (snapshot) => snapshot.relationships.apprenticeTrust
      ),
      townTrust: average(snapshots, (snapshot) => snapshot.relationships.townTrust)
    },
    values: {
      compassion: average(snapshots, (snapshot) => snapshot.values.compassion),
      prudence: average(snapshots, (snapshot) => snapshot.values.prudence),
      ambition: average(snapshots, (snapshot) => snapshot.values.ambition)
    }
  };
}

function average<T>(items: T[], getValue: (item: T) => number): number {
  if (items.length === 0) {
    return 0;
  }

  return items.reduce((total, item) => total + getValue(item), 0) / items.length;
}

function pickOne<T>(items: T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)];
}
